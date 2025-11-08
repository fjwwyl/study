<template>
  <div>
    287. 寻找重复数
    给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。
    假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。
    你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。
    示例 1：
    输入：nums = [1,3,4,2,2]
    输出：2
    示例 2：
    输入：nums = [3,1,3,4,2]
    输出：3
    示例 3 :
    输入：nums = [3,3,3,3,3]
    输出：3
  </div>
  <div>
    1695. 删除子数组的最大得分
    中等
    相关标签
    premium lock icon
    相关企业
    提示
    给你一个正整数数组 nums ，请你从中删除一个含有 若干不同元素 的子数组。删除子数组的 得分 就是子数组各元素之 和 。

    返回 只删除一个 子数组可获得的 最大得分 。

    如果数组 b 是数组 a 的一个连续子序列，即如果它等于 a[l],a[l+1],...,a[r] ，那么它就是 a 的一个子数组。


    示例 1：

    输入：nums = [4,2,4,5,6]
    输出：17
    解释：最优子数组是 [2,4,5,6]
    示例 2：

    输入：nums = [5,2,1,2,5,2,1,2,5]
    输出：8
    解释：最优子数组是 [5,2,1] 或 [1,2,5]
  </div>
  <div>
    301. 删除无效的括号
    困难
    相关标签
    premium lock icon
    相关企业
    提示
    给你一个由若干括号和字母组成的字符串 s ，删除最小数量的无效括号，使得输入的字符串有效。

    返回所有可能的结果。答案可以按 任意顺序 返回。


    示例 1：

    输入：s = "()())()"
    输出：["(())()","()()()"]
    示例 2：

    输入：s = "(a)())()"
    输出：["(a())()","(a)()()"]
    示例 3：

    输入：s = ")("
    输出：[""]
  </div>
  <div>
    309. 买卖股票的最佳时机含冷冻期
    中等
    相关标签
    premium lock icon
    相关企业
    给定一个整数数组prices，其中第  prices[i] 表示第 i 天的股票价格 。​

    设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:

    卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
    注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。



    示例 1:

    输入: prices = [1,2,3,0,2]
    输出: 3
    解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
    示例 2:

    输入: prices = [1]
    输出: 0

  </div>
</template>

<script>
export default {
  name: "7_19",
  created() {
    this.code287();
    console.log(this.code1695([4, 2, 4, 5, 6]));
  },
  methods: {
    code287() {

    },
    code1695(nums) {
      debugger
      let max = 0;
      let result = 0;
      const len = nums.length;
      let arr = [];

      let left = 0;
      for (let i = 0; i < len; i++) {
        max += nums[i];
        while (arr.includes(nums[i])) {
          const index = arr.indexOf(nums[left]);
          arr.splice(index, 1);
          max -= nums[left];
          left++;
        }
        arr.push(nums[i]);
        result = Math.max(result, max);
      }
      return result;
    },
    code301() {

    }
  }
}
</script>

<style scoped>

</style>