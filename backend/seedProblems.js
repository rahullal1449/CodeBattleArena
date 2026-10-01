require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const problems = [
    // ========================================================
    // EASY PROBLEMS (1 - 25)
    // ========================================================
    {
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9" }],
        starterCode: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
        functionName: "twoSum",
        testCases: [{ input: "[2,7,11,15], 9", expectedOutput: "[0,1]" }, { input: "[3,2,4], 6", expectedOutput: "[1,2]" }]
    },
    {
        title: "Reverse String",
        description: "Write a function that reverses a string given as an array of characters `s`.",
        difficulty: "Easy",
        tags: ["Two Pointers", "String"],
        constraints: ["1 <= s.length <= 10^5"],
        examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
        starterCode: `function reverseString(s) {
    // Write your solution here
    
}`,
        functionName: "reverseString",
        testCases: [{ input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' }]
    },
    {
        title: "Palindrome Number",
        description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
        difficulty: "Easy",
        tags: ["Math"],
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        examples: [{ input: "x = 121", output: "true" }],
        starterCode: `function isPalindrome(x) {
    // Write your solution here
    
}`,
        functionName: "isPalindrome",
        testCases: [{ input: "121", expectedOutput: "true" }, { input: "-121", expectedOutput: "false" }]
    },
    {
        title: "Valid Parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        constraints: ["1 <= s.length <= 10^4"],
        examples: [{ input: 's = "()[]{}"', output: "true" }],
        starterCode: `function isValid(s) {
    // Write your solution here
    
}`,
        functionName: "isValid",
        testCases: [{ input: '"()[]{}"', expectedOutput: "true" }, { input: '"(]"', expectedOutput: "false" }]
    },
    {
        title: "Binary Search",
        description: "Given an array of integers `nums` sorted in ascending order and an integer `target`, return the index of `target` or `-1`.",
        difficulty: "Easy",
        tags: ["Array", "Binary Search"],
        constraints: ["1 <= nums.length <= 10^4"],
        examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
        starterCode: `function search(nums, target) {
    // Write your solution here
    
}`,
        functionName: "search",
        testCases: [{ input: "[-1,0,3,5,9,12], 9", expectedOutput: "4" }, { input: "[-1,0,3,5,9,12], 2", expectedOutput: "-1" }]
    },
    {
        title: "Contains Duplicate",
        description: "Return `true` if any value appears at least twice in the array `nums`.",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        constraints: ["1 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
        starterCode: `function containsDuplicate(nums) {
    // Write your solution here
    
}`,
        functionName: "containsDuplicate",
        testCases: [{ input: "[1,2,3,1]", expectedOutput: "true" }, { input: "[1,2,3,4]", expectedOutput: "false" }]
    },
    {
        title: "Valid Anagram",
        description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`.",
        difficulty: "Easy",
        tags: ["String", "Sorting", "Hash Table"],
        constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
        examples: [{ input: 's = "anagram", t = "nagaram"', output: "true" }],
        starterCode: `function isAnagram(s, t) {
    // Write your solution here
    
}`,
        functionName: "isAnagram",
        testCases: [{ input: '"anagram", "nagaram"', expectedOutput: "true" }, { input: '"rat", "car"', expectedOutput: "false" }]
    },
    {
        title: "Best Time to Buy and Sell Stock",
        description: "Given an array `prices` where `prices[i]` is the stock price on day `i`, return maximum profit possible.",
        difficulty: "Easy",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= prices.length <= 10^5"],
        examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }],
        starterCode: `function maxProfit(prices) {
    // Write your solution here
    
}`,
        functionName: "maxProfit",
        testCases: [{ input: "[7,1,5,3,6,4]", expectedOutput: "5" }, { input: "[7,6,4,3,1]", expectedOutput: "0" }]
    },
    {
        title: "Merge Two Sorted Arrays",
        description: "Merge two sorted integer arrays `nums1` and `nums2` into a single sorted array.",
        difficulty: "Easy",
        tags: ["Array", "Two Pointers"],
        constraints: ["1 <= nums1.length, nums2.length <= 200"],
        examples: [{ input: "nums1 = [1,2,3], nums2 = [2,5,6]", output: "[1,2,2,3,5,6]" }],
        starterCode: `function merge(nums1, nums2) {
    // Write your solution here
    
}`,
        functionName: "merge",
        testCases: [{ input: "[1,2,3], [2,5,6]", expectedOutput: "[1,2,2,3,5,6]" }]
    },
    {
        title: "Single Number",
        description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
        difficulty: "Easy",
        tags: ["Bit Manipulation", "Array"],
        constraints: ["1 <= nums.length <= 3 * 10^4"],
        examples: [{ input: "nums = [4,1,2,1,2]", output: "4" }],
        starterCode: `function singleNumber(nums) {
    // Write your solution here
    
}`,
        functionName: "singleNumber",
        testCases: [{ input: "[2,2,1]", expectedOutput: "1" }, { input: "[4,1,2,1,2]", expectedOutput: "4" }]
    },
    {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
        difficulty: "Easy",
        tags: ["Dynamic Programming", "Math"],
        constraints: ["1 <= n <= 45"],
        examples: [{ input: "n = 3", output: "3" }],
        starterCode: `function climbStairs(n) {
    // Write your solution here
    
}`,
        functionName: "climbStairs",
        testCases: [{ input: "2", expectedOutput: "2" }, { input: "3", expectedOutput: "3" }]
    },
    {
        title: "Fibonacci Number",
        description: "The Fibonacci numbers F(n) form a sequence such that F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2). Given `n`, calculate F(n).",
        difficulty: "Easy",
        tags: ["Math", "Recursion"],
        constraints: ["0 <= n <= 30"],
        examples: [{ input: "n = 4", output: "3" }],
        starterCode: `function fib(n) {
    // Write your solution here
    
}`,
        functionName: "fib",
        testCases: [{ input: "2", expectedOutput: "1" }, { input: "4", expectedOutput: "3" }]
    },
    {
        title: "Missing Number",
        description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
        difficulty: "Easy",
        tags: ["Array", "Math", "Bit Manipulation"],
        constraints: ["n == nums.length"],
        examples: [{ input: "nums = [3,0,1]", output: "2" }],
        starterCode: `function missingNumber(nums) {
    // Write your solution here
    
}`,
        functionName: "missingNumber",
        testCases: [{ input: "[3,0,1]", expectedOutput: "2" }, { input: "[0,1]", expectedOutput: "2" }]
    },
    {
        title: "Move Zeroes",
        description: "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.",
        difficulty: "Easy",
        tags: ["Array", "Two Pointers"],
        constraints: ["1 <= nums.length <= 10^4"],
        examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }],
        starterCode: `function moveZeroes(nums) {
    // Write your solution here
    
}`,
        functionName: "moveZeroes",
        testCases: [{ input: "[0,1,0,3,12]", expectedOutput: "[1,3,12,0,0]" }]
    },
    {
        title: "Intersection of Two Arrays",
        description: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique.",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        constraints: ["1 <= nums1.length, nums2.length <= 1000"],
        examples: [{ input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" }],
        starterCode: `function intersection(nums1, nums2) {
    // Write your solution here
    
}`,
        functionName: "intersection",
        testCases: [{ input: "[1,2,2,1], [2,2]", expectedOutput: "[2]" }]
    },
    {
        title: "Majority Element",
        description: "Given an array `nums` of size `n`, return the majority element (element that appears more than ⌊n / 2⌋ times).",
        difficulty: "Easy",
        tags: ["Array", "Boyer-Moore Voting"],
        constraints: ["n == nums.length", "1 <= n <= 5 * 10^4"],
        examples: [{ input: "nums = [3,2,3]", output: "3" }],
        starterCode: `function majorityElement(nums) {
    // Write your solution here
    
}`,
        functionName: "majorityElement",
        testCases: [{ input: "[3,2,3]", expectedOutput: "3" }, { input: "[2,2,1,1,1,2,2]", expectedOutput: "2" }]
    },
    {
        title: "Is Subsequence",
        description: "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.",
        difficulty: "Easy",
        tags: ["Two Pointers", "String"],
        constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4"],
        examples: [{ input: 's = "abc", t = "ahbgdc"', output: "true" }],
        starterCode: `function isSubsequence(s, t) {
    // Write your solution here
    
}`,
        functionName: "isSubsequence",
        testCases: [{ input: '"abc", "ahbgdc"', expectedOutput: "true" }, { input: '"axc", "ahbgdc"', expectedOutput: "false" }]
    },
    {
        title: "Length of Last Word",
        description: "Given a string `s` consisting of words and spaces, return the length of the last word in the string.",
        difficulty: "Easy",
        tags: ["String"],
        constraints: ["1 <= s.length <= 10^4"],
        examples: [{ input: 's = "Hello World"', output: "5" }],
        starterCode: `function lengthOfLastWord(s) {
    // Write your solution here
    
}`,
        functionName: "lengthOfLastWord",
        testCases: [{ input: '"Hello World"', expectedOutput: "5" }, { input: '"   fly me   to   the moon  "', expectedOutput: "4" }]
    },
    {
        title: "Valid Palindrome",
        description: "Given a string `s`, return `true` if it is a palindrome considering only alphanumeric characters and ignoring cases.",
        difficulty: "Easy",
        tags: ["Two Pointers", "String"],
        constraints: ["1 <= s.length <= 2 * 10^5"],
        examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: "true" }],
        starterCode: `function isPalindromeString(s) {
    // Write your solution here
    
}`,
        functionName: "isPalindromeString",
        testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: "true" }, { input: '"race a car"', expectedOutput: "false" }]
    },
    {
        title: "Pascal's Triangle",
        description: "Given an integer `numRows`, return the first `numRows` of Pascal's triangle.",
        difficulty: "Easy",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= numRows <= 30"],
        examples: [{ input: "numRows = 3", output: "[[1],[1,1],[1,2,1]]" }],
        starterCode: `function generate(numRows) {
    // Write your solution here
    
}`,
        functionName: "generate",
        testCases: [{ input: "3", expectedOutput: "[[1],[1,1],[1,2,1]]" }]
    },
    {
        title: "Roman to Integer",
        description: "Given a roman numeral string `s`, convert it to an integer.",
        difficulty: "Easy",
        tags: ["Hash Table", "Math", "String"],
        constraints: ["1 <= s.length <= 15"],
        examples: [{ input: 's = "LVIII"', output: "58" }],
        starterCode: `function romanToInt(s) {
    // Write your solution here
    
}`,
        functionName: "romanToInt",
        testCases: [{ input: '"III"', expectedOutput: "3" }, { input: '"LVIII"', expectedOutput: "58" }]
    },
    {
        title: "Power of Two",
        description: "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.",
        difficulty: "Easy",
        tags: ["Math", "Bit Manipulation"],
        constraints: ["-2^31 <= n <= 2^31 - 1"],
        examples: [{ input: "n = 16", output: "true" }],
        starterCode: `function isPowerOfTwo(n) {
    // Write your solution here
    
}`,
        functionName: "isPowerOfTwo",
        testCases: [{ input: "16", expectedOutput: "true" }, { input: "3", expectedOutput: "false" }]
    },
    {
        title: "Symmetric Tree Check",
        description: "Given an array representation of binary tree values `arr`, determine if it forms a symmetric tree structure.",
        difficulty: "Easy",
        tags: ["Tree", "Array"],
        constraints: ["1 <= arr.length <= 1000"],
        examples: [{ input: "arr = [1,2,2,3,4,4,3]", output: "true" }],
        starterCode: `function isSymmetricArray(arr) {
    // Write your solution here
    
}`,
        functionName: "isSymmetricArray",
        testCases: [{ input: "[1,2,2,3,4,4,3]", expectedOutput: "true" }]
    },
    {
        title: "Plus One",
        description: "Given a large integer represented as an integer array `digits`, add one to the integer and return the resulting array of digits.",
        difficulty: "Easy",
        tags: ["Array", "Math"],
        constraints: ["1 <= digits.length <= 100"],
        examples: [{ input: "digits = [1,2,3]", output: "[1,2,4]" }],
        starterCode: `function plusOne(digits) {
    // Write your solution here
    
}`,
        functionName: "plusOne",
        testCases: [{ input: "[1,2,3]", expectedOutput: "[1,2,4]" }, { input: "[9]", expectedOutput: "[1,0]" }]
    },
    {
        title: "Remove Duplicates from Sorted Array",
        description: "Given a sorted array `nums`, remove duplicates in-place such that each unique element appears only once.",
        difficulty: "Easy",
        tags: ["Array", "Two Pointers"],
        constraints: ["1 <= nums.length <= 3 * 10^4"],
        examples: [{ input: "nums = [1,1,2]", output: "[1,2]" }],
        starterCode: `function removeDuplicates(nums) {
    // Write your solution here
    
}`,
        functionName: "removeDuplicates",
        testCases: [{ input: "[1,1,2]", expectedOutput: "[1,2]" }]
    },

    // ========================================================
    // MEDIUM PROBLEMS (26 - 55)
    // ========================================================
    {
        title: "Maximum Subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
        starterCode: `function maxSubArray(nums) {
    // Write your solution here
    
}`,
        functionName: "maxSubArray",
        testCases: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" }]
    },
    {
        title: "3Sum",
        description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `nums[i] + nums[j] + nums[k] == 0`.",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        constraints: ["3 <= nums.length <= 3000"],
        examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
        starterCode: `function threeSum(nums) {
    // Write your solution here
    
}`,
        functionName: "threeSum",
        testCases: [{ input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" }]
    },
    {
        title: "Container With Most Water",
        description: "Given `n` non-negative integers representing heights of vertical lines, find two lines that together with x-axis form a container holding most water.",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers"],
        constraints: ["2 <= height.length <= 10^5"],
        examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
        starterCode: `function maxArea(height) {
    // Write your solution here
    
}`,
        functionName: "maxArea",
        testCases: [{ input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" }]
    },
    {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        constraints: ["0 <= s.length <= 5 * 10^4"],
        examples: [{ input: 's = "abcabcbb"', output: "3" }],
        starterCode: `function lengthOfLongestSubstring(s) {
    // Write your solution here
    
}`,
        functionName: "lengthOfLongestSubstring",
        testCases: [{ input: '"abcabcbb"', expectedOutput: "3" }, { input: '"bbbbb"', expectedOutput: "1" }]
    },
    {
        title: "Group Anagrams",
        description: "Given an array of strings `strs`, group the anagrams together in any order.",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "String", "Sorting"],
        constraints: ["1 <= strs.length <= 10^4"],
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }],
        starterCode: `function groupAnagrams(strs) {
    // Write your solution here
    
}`,
        functionName: "groupAnagrams",
        testCases: [{ input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }]
    },
    {
        title: "Top K Frequent Elements",
        description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Bucket Sort"],
        constraints: ["1 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }],
        starterCode: `function topKFrequent(nums, k) {
    // Write your solution here
    
}`,
        functionName: "topKFrequent",
        testCases: [{ input: "[1,1,1,2,2,3], 2", expectedOutput: "[1,2]" }]
    },
    {
        title: "Product of Array Except Self",
        description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all elements of `nums` except `nums[i]`.",
        difficulty: "Medium",
        tags: ["Array", "Prefix Sum"],
        constraints: ["2 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }],
        starterCode: `function productExceptSelf(nums) {
    // Write your solution here
    
}`,
        functionName: "productExceptSelf",
        testCases: [{ input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" }]
    },
    {
        title: "Coin Change",
        description: "Given an integer array `coins` and total amount `amount`, return fewest number of coins needed to make up that amount, or `-1`.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
        examples: [{ input: "coins = [1,2,5], amount = 11", output: "3" }],
        starterCode: `function coinChange(coins, amount) {
    // Write your solution here
    
}`,
        functionName: "coinChange",
        testCases: [{ input: "[1,2,5], 11", expectedOutput: "3" }, { input: "[2], 3", expectedOutput: "-1" }]
    },
    {
        title: "House Robber",
        description: "Given integer array `nums` representing money in houses, return maximum money you can rob without triggering adjacent house alarms.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= nums.length <= 100"],
        examples: [{ input: "nums = [1,2,3,1]", output: "4" }],
        starterCode: `function rob(nums) {
    // Write your solution here
    
}`,
        functionName: "rob",
        testCases: [{ input: "[1,2,3,1]", expectedOutput: "4" }, { input: "[2,7,9,3,1]", expectedOutput: "12" }]
    },
    {
        title: "Search in Rotated Sorted Array",
        description: "Given a rotated sorted array `nums` and a `target`, return index of `target` or `-1`.",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        constraints: ["1 <= nums.length <= 5000"],
        examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }],
        starterCode: `function searchRotated(nums, target) {
    // Write your solution here
    
}`,
        functionName: "searchRotated",
        testCases: [{ input: "[4,5,6,7,0,1,2], 0", expectedOutput: "4" }]
    },
    {
        title: "Find Minimum in Rotated Sorted Array",
        description: "Given a rotated sorted array `nums` of unique elements, return the minimum element of this array.",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        constraints: ["1 <= nums.length <= 5000"],
        examples: [{ input: "nums = [3,4,5,1,2]", output: "1" }],
        starterCode: `function findMin(nums) {
    // Write your solution here
    
}`,
        functionName: "findMin",
        testCases: [{ input: "[3,4,5,1,2]", expectedOutput: "1" }]
    },
    {
        title: "Subarray Sum Equals K",
        description: "Given an array of integers `nums` and integer `k`, return total number of subarrays whose sum equals `k`.",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Prefix Sum"],
        constraints: ["1 <= nums.length <= 2 * 10^4"],
        examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }],
        starterCode: `function subarraySum(nums, k) {
    // Write your solution here
    
}`,
        functionName: "subarraySum",
        testCases: [{ input: "[1,1,1], 2", expectedOutput: "2" }]
    },
    {
        title: "Longest Consecutive Sequence",
        description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Union Find"],
        constraints: ["0 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [100,4,200,1,3,2]", output: "4" }],
        starterCode: `function longestConsecutive(nums) {
    // Write your solution here
    
}`,
        functionName: "longestConsecutive",
        testCases: [{ input: "[100,4,200,1,3,2]", expectedOutput: "4" }]
    },
    {
        title: "Sort Colors (Dutch National Flag)",
        description: "Given an array `nums` with `n` objects colored red, white, or blue (0, 1, 2), sort them in-place.",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        constraints: ["1 <= nums.length <= 300"],
        examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
        starterCode: `function sortColors(nums) {
    // Write your solution here
    
}`,
        functionName: "sortColors",
        testCases: [{ input: "[2,0,2,1,1,0]", expectedOutput: "[0,0,1,1,2,2]" }]
    },
    {
        title: "Kth Largest Element in an Array",
        description: "Given an integer array `nums` and integer `k`, return the `k-th` largest element in the array.",
        difficulty: "Medium",
        tags: ["Array", "Sorting", "Heap"],
        constraints: ["1 <= k <= nums.length <= 10^5"],
        examples: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }],
        starterCode: `function findKthLargest(nums, k) {
    // Write your solution here
    
}`,
        functionName: "findKthLargest",
        testCases: [{ input: "[3,2,1,5,6,4], 2", expectedOutput: "5" }]
    },
    {
        title: "Unique Paths",
        description: "A robot is located at top-left corner of `m x n` grid. Robot can move right or down. Find number of unique paths to bottom-right corner.",
        difficulty: "Medium",
        tags: ["Dynamic Programming", "Math"],
        constraints: ["1 <= m, n <= 100"],
        examples: [{ input: "m = 3, n = 7", output: "28" }],
        starterCode: `function uniquePaths(m, n) {
    // Write your solution here
    
}`,
        functionName: "uniquePaths",
        testCases: [{ input: "3, 7", expectedOutput: "28" }]
    },
    {
        title: "Jump Game",
        description: "Given an integer array `nums` where `nums[i]` is max jump length, return `true` if you can reach the last index.",
        difficulty: "Medium",
        tags: ["Array", "Greedy", "Dynamic Programming"],
        constraints: ["1 <= nums.length <= 10^4"],
        examples: [{ input: "nums = [2,3,1,1,4]", output: "true" }],
        starterCode: `function canJump(nums) {
    // Write your solution here
    
}`,
        functionName: "canJump",
        testCases: [{ input: "[2,3,1,1,4]", expectedOutput: "true" }, { input: "[3,2,1,0,4]", expectedOutput: "false" }]
    },
    {
        title: "Decode Ways",
        description: "A message containing letters A-Z is encoded to numbers using 'A' -> 1, 'B' -> 2, ..., 'Z' -> 26. Determine total number of ways to decode `s`.",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        constraints: ["1 <= s.length <= 100"],
        examples: [{ input: 's = "226"', output: "3" }],
        starterCode: `function numDecodings(s) {
    // Write your solution here
    
}`,
        functionName: "numDecodings",
        testCases: [{ input: '"226"', expectedOutput: "3" }]
    },
    {
        title: "Rotate Image",
        description: "Given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees clockwise in-place.",
        difficulty: "Medium",
        tags: ["Array", "Math", "Matrix"],
        constraints: ["n == matrix.length == matrix[i].length"],
        examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }],
        starterCode: `function rotateMatrix(matrix) {
    // Write your solution here
    
}`,
        functionName: "rotateMatrix",
        testCases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]" }]
    },
    {
        title: "Generate Parentheses",
        description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
        difficulty: "Medium",
        tags: ["String", "Backtracking", "Dynamic Programming"],
        constraints: ["1 <= n <= 8"],
        examples: [{ input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]' }],
        starterCode: `function generateParenthesis(n) {
    // Write your solution here
    
}`,
        functionName: "generateParenthesis",
        testCases: [{ input: "3", expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]' }]
    },

    // ========================================================
    // HARD PROBLEMS (56 - 75)
    // ========================================================
    {
        title: "Trapping Rain Water",
        description: "Given `n` non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.",
        difficulty: "Hard",
        tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"],
        constraints: ["n == height.length", "1 <= n <= 2 * 10^4"],
        examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
        starterCode: `function trap(height) {
    // Write your solution here
    
}`,
        functionName: "trap",
        testCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" }]
    },
    {
        title: "N-Queens",
        description: "The n-queens puzzle is placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Return total distinct solutions count.",
        difficulty: "Hard",
        tags: ["Backtracking"],
        constraints: ["1 <= n <= 9"],
        examples: [{ input: "n = 4", output: "2" }],
        starterCode: `function totalNQueens(n) {
    // Write your solution here
    
}`,
        functionName: "totalNQueens",
        testCases: [{ input: "4", expectedOutput: "2" }]
    },
    {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n`, return the median of the two sorted arrays.",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000"],
        examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2" }],
        starterCode: `function findMedianSortedArrays(nums1, nums2) {
    // Write your solution here
    
}`,
        functionName: "findMedianSortedArrays",
        testCases: [{ input: "[1,3], [2]", expectedOutput: "2" }, { input: "[1,2], [3,4]", expectedOutput: "2.5" }]
    },
    {
        title: "Minimum Window Substring",
        description: "Given two strings `s` and `t`, return minimum window substring of `s` such that every character in `t` (including duplicates) is included.",
        difficulty: "Hard",
        tags: ["Hash Table", "String", "Sliding Window"],
        constraints: ["1 <= s.length, t.length <= 10^5"],
        examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }],
        starterCode: `function minWindow(s, t) {
    // Write your solution here
    
}`,
        functionName: "minWindow",
        testCases: [{ input: '"ADOBECODEBANC", "ABC"', expectedOutput: '"BANC"' }]
    },
    {
        title: "Edit Distance (Levenshtein)",
        description: "Given two strings `word1` and `word2`, return minimum number of operations required to convert `word1` to `word2` (insert, delete, replace).",
        difficulty: "Hard",
        tags: ["String", "Dynamic Programming"],
        constraints: ["0 <= word1.length, word2.length <= 500"],
        examples: [{ input: 'word1 = "horse", word2 = "ros"', output: "3" }],
        starterCode: `function minDistance(word1, word2) {
    // Write your solution here
    
}`,
        functionName: "minDistance",
        testCases: [{ input: '"horse", "ros"', expectedOutput: "3" }]
    },
    {
        title: "First Missing Positive",
        description: "Given an unsorted integer array `nums`, return the smallest missing positive integer.",
        difficulty: "Hard",
        tags: ["Array", "Hash Table"],
        constraints: ["1 <= nums.length <= 10^5"],
        examples: [{ input: "nums = [1,2,0]", output: "3" }],
        starterCode: `function firstMissingPositive(nums) {
    // Write your solution here
    
}`,
        functionName: "firstMissingPositive",
        testCases: [{ input: "[1,2,0]", expectedOutput: "3" }, { input: "[3,4,-1,1]", expectedOutput: "2" }]
    },
    {
        title: "Sliding Window Maximum",
        description: "Given array `nums` and sliding window size `k`, return max element in each sliding window.",
        difficulty: "Hard",
        tags: ["Array", "Queue", "Sliding Window", "Monotonic Queue"],
        constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
        examples: [{ input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }],
        starterCode: `function maxSlidingWindow(nums, k) {
    // Write your solution here
    
}`,
        functionName: "maxSlidingWindow",
        testCases: [{ input: "[1,3,-1,-3,5,3,6,7], 3", expectedOutput: "[3,3,5,5,6,7]" }]
    },
    {
        title: "Largest Rectangle in Histogram",
        description: "Given integer array `heights` representing histogram's bar height where width of each bar is 1, return area of largest rectangle in histogram.",
        difficulty: "Hard",
        tags: ["Array", "Stack", "Monotonic Stack"],
        constraints: ["1 <= heights.length <= 10^5"],
        examples: [{ input: "heights = [2,1,5,6,2,3]", output: "10" }],
        starterCode: `function largestRectangleArea(heights) {
    // Write your solution here
    
}`,
        functionName: "largestRectangleArea",
        testCases: [{ input: "[2,1,5,6,2,3]", expectedOutput: "10" }]
    },
    {
        title: "Regular Expression Matching",
        description: "Given input string `s` and pattern `p`, implement regular expression matching with support for '.' and '*'.",
        difficulty: "Hard",
        tags: ["String", "Dynamic Programming", "Recursion"],
        constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
        examples: [{ input: 's = "aa", p = "a*"', output: "true" }],
        starterCode: `function isMatch(s, p) {
    // Write your solution here
    
}`,
        functionName: "isMatch",
        testCases: [{ input: '"aa", "a*"', expectedOutput: "true" }, { input: '"ab", ".*"', expectedOutput: "true" }]
    },
    {
        title: "Burst Balloons",
        description: "Given `n` balloons indexed 0 to n-1 with numbers `nums`. Bursting balloon `i` gives `nums[i-1] * nums[i] * nums[i+1]` coins. Return max coins you can collect.",
        difficulty: "Hard",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["n == nums.length", "1 <= n <= 300"],
        examples: [{ input: "nums = [3,1,5,8]", output: "167" }],
        starterCode: `function maxCoins(nums) {
    // Write your solution here
    
}`,
        functionName: "maxCoins",
        testCases: [{ input: "[3,1,5,8]", expectedOutput: "167" }]
    }
];

const seedProblems = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");

        await Problem.deleteMany();
        await Problem.insertMany(problems);

        console.log(`Successfully added ${problems.length} Classic LeetCode Problems (Easy, Medium, Hard)! 🎉`);
        await mongoose.connection.close();
    } catch (error) {
        console.error("Seeding Error:", error.message);
    }
};

seedProblems();