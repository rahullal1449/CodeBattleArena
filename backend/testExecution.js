const executeCode = require("./services/codeExecutionService");

const test = async () => {
    try {
        const result = await executeCode(
            'console.log("Hello CodeBattleArena");'
        );

        console.log("Execution Result:");
        console.log(result);
    } catch (error) {
        console.error("Test failed");
    }
};

test();