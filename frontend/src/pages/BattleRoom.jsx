import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import socket from "../services/socket";

import { SUPPORTED_LANGUAGES, getTemplateCode } from "../utils/languageTemplates";
import TestCaseTray from "../components/TestCaseTray";

function BattleRoom() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [battle, setBattle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Countdown & Battle State
    const [countdown, setCountdown] = useState(null);
    const [starting, setStarting] = useState(false);

    // 10-Minute Battle Timer (600 Seconds)
    const [timeLeft, setTimeLeft] = useState(600);

    // Opponent real-time status & Victory state
    const [opponentStatus, setOpponentStatus] = useState("🟢 Connected");
    const [battleWinnerData, setBattleWinnerData] = useState(null);

    // WebRTC & Camera States
    const [cameraActive, setCameraActive] = useState(false);
    const [micActive, setMicActive] = useState(true);
    const [opponentVideoActive, setOpponentVideoActive] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    // Code execution state inside battle
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Test Case Results & Verdict Data State
    const [testResults, setTestResults] = useState(null);
    const [verdictData, setVerdictData] = useState(null);

    // Fetch battle details from backend
    const fetchBattleDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/api/battles/${roomCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const battleData = response.data.battle;
            setBattle(battleData);
            if (battleData.status === "completed") {
                setBattleWinnerData({
                    winner: battleData.winner
                });
            }
            if (battleData.problem && !code) {
                setCode(battleData.problem.starterCode || "");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching battle:", err);
            setError(err.response?.data?.message || "Failed to load battle room");
            setLoading(false);
        }
    };

    // WEBRTC INITIALIZATION & SIGNALING
    const createPeerConnection = () => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && roomCode) {
                socket.emit("webrtcIceCandidate", {
                    roomCode: roomCode.toUpperCase(),
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setOpponentVideoActive(true);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    // TOGGLE CAMERA / MEDIA STREAM
    const toggleCamera = async () => {
        if (cameraActive) {
            // Turn off camera
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
            setCameraActive(false);
            socket.emit("toggleMedia", { roomCode: roomCode.toUpperCase(), type: "video", enabled: false });
        } else {
            // Turn on camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micActive });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setCameraActive(true);

                const pc = createPeerConnection();
                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                // Create offer if Host
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                socket.emit("webrtcOffer", {
                    roomCode: roomCode.toUpperCase(),
                    offer
                });

                socket.emit("toggleMedia", { roomCode: roomCode.toUpperCase(), type: "video", enabled: true });
            } catch (err) {
                console.error("Camera Access Denied/Error:", err);
                alert("Camera/Microphone permission denied. Battle will continue normally without video!");
            }
        }
    };

    // TOGGLE MICROPHONE
    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !micActive;
                setMicActive(!micActive);
            }
        } else {
            setMicActive(!micActive);
        }
    };

    useEffect(() => {
        if (!roomCode) return;

        fetchBattleDetails();

        const handleConnect = () => {
            socket.emit("joinBattleRoom", roomCode.toUpperCase());
        };

        const handleOpponentJoined = () => {
            fetchBattleDetails();
        };

        const handleBattleCountdown = (data) => {
            setCountdown(data.countdown);
        };

        const handleBattleStarted = (data) => {
            setCountdown(null);
            setBattle(data.battle);
            setTimeLeft(600);
            if (data.battle.problem) {
                setCode(data.battle.problem.starterCode || "");
            }
        };

        const handleOpponentStatusUpdated = (data) => {
            setOpponentStatus(data.statusText);
        };

        const handleBattleCompleted = (data) => {
            setBattleWinnerData(data);
            setBattle(prev => prev ? { ...prev, status: "completed" } : prev);
        };

        // WebRTC Socket Listeners
        const handleWebRTCOffer = async ({ offer }) => {
            try {
                const pc = createPeerConnection();
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.emit("webrtcAnswer", {
                    roomCode: roomCode.toUpperCase(),
                    answer
                });
            } catch (e) {
                console.error("WebRTC offer error:", e);
            }
        };

        const handleWebRTCAnswer = async ({ answer }) => {
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } catch (e) {
                console.error("WebRTC answer error:", e);
            }
        };

        const handleWebRTCIceCandidate = async ({ candidate }) => {
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (e) {
                console.error("WebRTC candidate error:", e);
            }
        };

        const handleOpponentMediaToggled = ({ type, enabled }) => {
            if (type === "video") {
                setOpponentVideoActive(enabled);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("opponentJoined", handleOpponentJoined);
        socket.on("battleCountdown", handleBattleCountdown);
        socket.on("battleStarted", handleBattleStarted);
        socket.on("opponentStatusUpdated", handleOpponentStatusUpdated);
        socket.on("battleCompleted", handleBattleCompleted);
        socket.on("webrtcOffer", handleWebRTCOffer);
        socket.on("webrtcAnswer", handleWebRTCAnswer);
        socket.on("webrtcIceCandidate", handleWebRTCIceCandidate);
        socket.on("opponentMediaToggled", handleOpponentMediaToggled);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("opponentJoined", handleOpponentJoined);
            socket.off("battleCountdown", handleBattleCountdown);
            socket.off("battleStarted", handleBattleStarted);
            socket.off("opponentStatusUpdated", handleOpponentStatusUpdated);
            socket.off("battleCompleted", handleBattleCompleted);
            socket.off("webrtcOffer", handleWebRTCOffer);
            socket.off("webrtcAnswer", handleWebRTCAnswer);
            socket.off("webrtcIceCandidate", handleWebRTCIceCandidate);
            socket.off("opponentMediaToggled", handleOpponentMediaToggled);
            
            // Clean tracks on unmount
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [roomCode]);

    // 10-MINUTE BATTLE TIMER TICKER
    useEffect(() => {
        if (battle?.status !== "active" || battleWinnerData) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setBattleWinnerData({ isDraw: true });
                    setBattle((b) => b ? { ...b, status: "completed" } : b);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [battle?.status, battleWinnerData]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCodeChange = (val) => {
        const newCode = val || "";
        setCode(newCode);

        const token = localStorage.getItem("token");
        if (token && roomCode) {
            try {
                const user = JSON.parse(atob(token.split('.')[1]));
                socket.emit("updateOpponentStatus", {
                    roomCode: roomCode.toUpperCase(),
                    username: user.username,
                    statusText: "⌨️ Coding..."
                });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleStartBattle = async () => {
        try {
            setStarting(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/api/battles/start",
                { roomCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            socket.emit("startBattle", {
                roomCode: roomCode.toUpperCase(),
                battle: response.data.battle
            });
        } catch (err) {
            console.error("Failed to start battle:", err);
            alert(err.response?.data?.message || "Failed to start battle");
            setStarting(false);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getTemplateCode(newLang, battle?.problem));
    };

    const handleRunCode = async () => {
        try {
            setRunning(true);
            setOutput("");
            setVerdictData(null);
            setTestResults(null);
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await axios.post(`${apiUrl}/api/code/run`, {
                code,
                problemId: battle?.problem?._id,
                language
            });

            if (response.data.testCaseResults) {
                setTestResults(response.data.testCaseResults);
            }
            setOutput(response.data.output || response.data.error || "Execution completed.");
        } catch (err) {
            setOutput("Execution Error: " + (err.response?.data?.message || err.message));
        } finally {
            setRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!battle?.problem) return;
        try {
            setSubmitting(true);
            setVerdictData(null);
            setTestResults(null);
            const token = localStorage.getItem("token");
            const user = JSON.parse(atob(token.split('.')[1]));
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            socket.emit("updateOpponentStatus", {
                roomCode: roomCode.toUpperCase(),
                username: user.username,
                statusText: "📤 Submitted..."
            });

            const response = await axios.post(
                `${apiUrl}/api/code/submit`,
                {
                    code,
                    problemId: battle.problem._id,
                    roomCode,
                    language
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVerdictData(response.data);

            if (response.data.verdict === "Accepted") {
                socket.emit("updateOpponentStatus", {
                    roomCode: roomCode.toUpperCase(),
                    username: user.username,
                    statusText: "✅ Accepted!"
                });

                socket.emit("battleEnded", {
                    roomCode: roomCode.toUpperCase(),
                    winnerUsername: user.username,
                    winnerId: user.userId,
                    battleResult: response.data.battleResult
                });
            }
        } catch (err) {
            setOutput("Submission Failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "100px" }}><h2>⏳ Loading Battle Room...</h2></div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", color: "var(--accent-red)" }}>
                <h2>⚠️ Error: {error}</h2>
                <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px", padding: "10px 20px" }}>Back to Dashboard</button>
            </div>
        );
    }

    const token = localStorage.getItem("token");
    let currentUserId = null;
    if (token) {
        try {
            currentUserId = JSON.parse(atob(token.split('.')[1])).userId;
        } catch(e) {
            console.error(e);
        }
    }

    // 1. COUNTDOWN OVERLAY
    if (countdown !== null) {
        return (
            <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(11, 14, 20, 0.96)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                zIndex: 9999
            }}>
                <h1 style={{ fontSize: "2.5rem", color: "var(--accent-red)", letterSpacing: "2px" }}>⚔️ BATTLE STARTING IN</h1>
                <h1 style={{ fontSize: "9rem", margin: "10px 0", color: "var(--accent-green)", fontWeight: "900" }}>{countdown}</h1>
                <h2 style={{ letterSpacing: "1px", color: "var(--accent-yellow)" }}>GET READY TO CODE! 🔥</h2>
            </div>
        );
    }

    // 2. BATTLE COMPLETED OVERLAY
    if (battleWinnerData || battle?.status === "completed") {
        const isDraw = battleWinnerData?.isDraw;
        const winnerId = battleWinnerData?.winnerId || battleWinnerData?.winner?._id || battleWinnerData?.winner || battleWinnerData?.battleResult?.winner?._id || battle?.winner?._id || battle?.winner;
        const isWinner = !isDraw && winnerId && String(winnerId) === String(currentUserId);
        const winnerUsername = battleWinnerData?.winnerUsername || battleWinnerData?.winner?.username || battle?.winner?.username || "Player";

        return (
            <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(11, 14, 20, 0.92)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                zIndex: 9999,
                padding: "20px"
            }}>
                <div
                    className={isDraw ? "glass-card" : isWinner ? "glass-card glow-green" : "glass-card glow-red"}
                    style={{
                        maxWidth: "520px",
                        width: "100%",
                        textAlign: "center",
                        padding: "40px"
                    }}
                >
                    {isDraw ? (
                        <>
                            <h1 style={{ fontSize: "3rem", color: "var(--accent-yellow)", margin: 0 }}>⏱️ TIME EXPIRED</h1>
                            <h2 style={{ fontSize: "1.6rem", margin: "15px 0", color: "#fff" }}>Match ended in a Draw!</h2>
                            <p style={{ color: "var(--text-muted)" }}>10-minute battle timer ran out without any accepted solution.</p>
                            <div style={{ background: "rgba(255, 183, 3, 0.1)", border: "1px solid var(--accent-yellow)", padding: "16px", borderRadius: "10px", margin: "25px 0" }}>
                                <p style={{ color: "var(--accent-yellow)", fontSize: "1.1rem", fontWeight: "bold" }}>🤝 0 Rating Change | +5 Participation XP</p>
                            </div>
                        </>
                    ) : isWinner ? (
                        <>
                            <h1 style={{ fontSize: "3rem", color: "var(--accent-green)", margin: 0 }}>👑 VICTORY!</h1>
                            <h2 style={{ fontSize: "1.6rem", margin: "15px 0", color: "#fff" }}>Congratulations! You won the battle! 🎉</h2>
                            <p style={{ color: "var(--text-muted)" }}>Reason: First Accepted Submission</p>
                            <div style={{ background: "rgba(0, 255, 136, 0.1)", border: "1px solid var(--accent-green)", padding: "16px", borderRadius: "10px", margin: "25px 0" }}>
                                <p style={{ color: "var(--accent-green)", fontSize: "1.2rem", fontWeight: "bold" }}>⚡ +25 Rating | 🔥 +25 XP</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={{ fontSize: "3rem", color: "var(--accent-red)", margin: 0 }}>💀 DEFEAT</h1>
                            <h2 style={{ fontSize: "1.5rem", margin: "15px 0", color: "#fff" }}>{winnerUsername} solved the problem first!</h2>
                            <p style={{ color: "var(--text-muted)" }}>Better luck next time!</p>
                            <div style={{ background: "rgba(255, 71, 87, 0.1)", border: "1px solid var(--accent-red)", padding: "16px", borderRadius: "10px", margin: "25px 0" }}>
                                <p style={{ color: "var(--accent-red)", fontSize: "1.1rem", fontWeight: "bold" }}>📉 -15 Rating | 💥 +5 Participation XP</p>
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            padding: "12px 32px",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            backgroundColor: isDraw ? "var(--accent-yellow)" : isWinner ? "var(--accent-green)" : "var(--accent-red)",
                            color: "#000",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        🏠 Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 3. ACTIVE BATTLE ARENA (Coding Mode with WebRTC Video Tray)
    if (battle?.status === "active" && battle?.problem) {
        return (
            <div style={{ padding: "20px", color: "#fff", backgroundColor: "var(--bg-primary)", minHeight: "calc(100vh - 70px)" }}>
                {/* Header Bar */}
                <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>⚔️ 1v1 BATTLE ARENA</h2>
                        <span style={{ color: "var(--accent-green)", fontSize: "0.85rem", fontWeight: "bold", background: "rgba(0,255,136,0.1)", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--accent-green)" }}>
                            ROOM: {roomCode}
                        </span>
                    </div>

                    {/* 10-MINUTE BATTLE TIMER */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "1.3rem",
                        fontWeight: "900",
                        color: timeLeft <= 120 ? "var(--accent-red)" : "var(--accent-green)",
                        backgroundColor: "var(--bg-secondary)",
                        padding: "6px 18px",
                        borderRadius: "20px",
                        border: timeLeft <= 120 ? "1px solid var(--accent-red)" : "1px solid var(--accent-green)"
                    }}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>

                    {/* WebRTC Video & Media Controls */}
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                            onClick={toggleCamera}
                            style={{
                                padding: "6px 14px",
                                backgroundColor: cameraActive ? "rgba(0,255,136,0.2)" : "rgba(255,71,87,0.2)",
                                color: cameraActive ? "var(--accent-green)" : "var(--accent-red)",
                                border: cameraActive ? "1px solid var(--accent-green)" : "1px solid var(--accent-red)",
                                fontSize: "0.85rem"
                            }}
                        >
                            {cameraActive ? "📹 Camera ON" : "📹 Enable Camera"}
                        </button>

                        <button
                            onClick={toggleMic}
                            style={{
                                padding: "6px 14px",
                                backgroundColor: micActive ? "rgba(0,229,255,0.2)" : "rgba(255,71,87,0.2)",
                                color: micActive ? "var(--accent-cyan)" : "var(--accent-red)",
                                border: micActive ? "1px solid var(--accent-cyan)" : "1px solid var(--accent-red)",
                                fontSize: "0.85rem"
                            }}
                        >
                            {micActive ? "🎤 Mic ON" : "🎤 Mic OFF"}
                        </button>
                    </div>
                </div>

                {/* Optional WebRTC Video Stream Tray */}
                {(cameraActive || opponentVideoActive) && (
                    <div className="glass-card" style={{ display: "flex", gap: "20px", marginBottom: "16px", padding: "12px", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "160px", height: "100px", borderRadius: "8px", objectFit: "cover", backgroundColor: "#000", border: "1px solid var(--accent-green)" }} />
                            <p style={{ fontSize: "0.75rem", color: "var(--accent-green)", marginTop: "4px" }}>You (Local)</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "160px", height: "100px", borderRadius: "8px", objectFit: "cover", backgroundColor: "#000", border: "1px solid var(--accent-cyan)" }} />
                            <p style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", marginTop: "4px" }}>Opponent (Remote)</p>
                        </div>
                    </div>
                )}

                {/* Split Layout */}
                <div style={{ display: "flex", gap: "16px" }}>
                    {/* Left Pane: Problem Description */}
                    <div className="glass-card" style={{ flex: 1, height: "76vh", overflowY: "auto" }}>
                        <h2 style={{ color: "var(--accent-green)", fontSize: "1.5rem" }}>{battle.problem.title}</h2>
                        <span style={{ padding: "4px 10px", borderRadius: "4px", backgroundColor: "rgba(255, 183, 3, 0.15)", color: "var(--accent-yellow)", border: "1px solid var(--accent-yellow)", fontSize: "0.8rem", fontWeight: "bold" }}>
                            {battle.problem.difficulty}
                        </span>

                        <h3 style={{ marginTop: "18px", color: "var(--text-main)", fontSize: "1.1rem" }}>Problem Description</h3>
                        <p style={{ lineHeight: "1.6", color: "var(--text-muted)", fontSize: "0.95rem" }}>{battle.problem.description}</p>

                        <h3 style={{ marginTop: "18px", color: "var(--text-main)", fontSize: "1.1rem" }}>Constraints</h3>
                        <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", lineHeight: "1.8", fontSize: "0.9rem" }}>
                            {battle.problem.constraints?.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>

                        <h3 style={{ marginTop: "18px", color: "var(--text-main)", fontSize: "1.1rem" }}>Examples</h3>
                        {battle.problem.examples?.map((ex, i) => (
                            <div key={i} style={{ background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: "8px", marginBottom: "12px", border: "1px solid var(--border-color)" }}>
                                <p style={{ color: "var(--text-main)", fontSize: "0.9rem" }}><strong>Input:</strong> <code style={{ color: "var(--accent-cyan)" }}>{ex.input}</code></p>
                                <p style={{ color: "var(--text-main)", marginTop: "4px", fontSize: "0.9rem" }}><strong>Output:</strong> <code style={{ color: "var(--accent-green)" }}>{ex.output}</code></p>
                                {ex.explanation && <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "0.85rem" }}><strong>Explanation:</strong> {ex.explanation}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Right Pane: Editor */}
                    <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div className="glass-card" style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {/* Language Selector Dropdown */}
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    color: "var(--accent-cyan)",
                                    border: "1px solid var(--accent-cyan)",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    fontSize: "0.88rem",
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                {SUPPORTED_LANGUAGES.map(lang => (
                                    <option key={lang.id} value={lang.id} style={{ backgroundColor: "#151921", color: "#fff" }}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={handleRunCode} disabled={running} style={{ padding: "8px 18px", backgroundColor: "#2ed47e", color: "#fff", fontSize: "0.9rem" }}>
                                    {running ? "Running..." : "▶️ Run"}
                                </button>
                                <button onClick={handleSubmitCode} disabled={submitting} style={{ padding: "8px 18px", backgroundColor: "var(--accent-red)", color: "#fff", fontSize: "0.9rem" }}>
                                    {submitting ? "Submitting..." : "🚀 Submit"}
                                </button>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: "10px" }}>
                            <Editor
                                height="400px"
                                language={SUPPORTED_LANGUAGES.find(l => l.id === language)?.monacoLang || "javascript"}
                                value={code}
                                onChange={handleCodeChange}
                                theme="vs-dark"
                                options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                            />
                        </div>

                        {/* LeetCode Test Case Tray */}
                        <TestCaseTray
                            testResults={testResults}
                            verdictData={verdictData}
                            output={output}
                            running={running}
                            submitLoading={submitting}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // 4. LOBBY VIEW
    const isHost = battle?.player1?._id === currentUserId || battle?.player1 === currentUserId;

    return (
        <div style={{ maxWidth: "650px", margin: "60px auto", padding: "0 20px" }}>
            <div className="glass-card" style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>⚔️ CODEARENA 1v1 BATTLE</h1>
                <div style={{ background: "var(--bg-secondary)", display: "inline-block", padding: "8px 20px", borderRadius: "8px", border: "1px solid var(--border-color)", margin: "10px 0" }}>
                    ROOM CODE: <span style={{ color: "var(--accent-green)", fontWeight: "bold", fontSize: "1.2rem" }}>{battle?.roomCode}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", margin: "35px 0" }}>
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "10px", width: "42%" }}>
                        <h4 style={{ color: "var(--accent-yellow)" }}>👑 Host (Player 1)</h4>
                        <p style={{ fontSize: "1.3rem", fontWeight: "bold", margin: "10px 0" }}>{battle?.player1?.username || "Unknown"}</p>
                        <p style={{ color: "var(--text-muted)" }}>Rating: ⚡ {battle?.player1?.rating ?? 1000}</p>
                    </div>

                    <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--accent-red)" }}>
                        VS
                    </div>

                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "10px", width: "42%" }}>
                        <h4 style={{ color: "var(--accent-cyan)" }}>⚔️ Player 2</h4>
                        {battle?.player2 ? (
                            <>
                                <p style={{ fontSize: "1.3rem", fontWeight: "bold", margin: "10px 0" }}>{battle?.player2?.username}</p>
                                <p style={{ color: "var(--text-muted)" }}>Rating: ⚡ {battle?.player2?.rating ?? 1000}</p>
                            </>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "15px" }}>⏳ Waiting for opponent...</p>
                        )}
                    </div>
                </div>

                <div style={{ padding: "20px", backgroundColor: battle?.status === "ready" ? "rgba(0, 255, 136, 0.1)" : "var(--bg-secondary)", borderRadius: "10px", border: battle?.status === "ready" ? "1px solid var(--accent-green)" : "1px solid var(--border-color)" }}>
                    {battle?.status === "ready" ? (
                        <div>
                            <h3 style={{ color: "var(--accent-green)", marginBottom: "15px" }}>🟢 BOTH PLAYERS READY!</h3>
                            {isHost ? (
                                <button
                                    onClick={handleStartBattle}
                                    disabled={starting}
                                    style={{
                                        padding: "14px 40px",
                                        fontSize: "1.1rem",
                                        backgroundColor: "var(--accent-red)",
                                        color: "#fff",
                                        boxShadow: "0 0 15px rgba(255, 71, 87, 0.4)"
                                    }}
                                >
                                    {starting ? "Starting..." : "🚀 START BATTLE!"}
                                </button>
                            ) : (
                                <p style={{ color: "var(--text-muted)", margin: 0 }}>Waiting for Host to click Start Battle...</p>
                            )}
                        </div>
                    ) : (
                        <h4 style={{ color: "var(--accent-yellow)", margin: 0 }}>⏳ Share room code with a friend to join</h4>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BattleRoom;