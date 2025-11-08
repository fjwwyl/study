<template>
  <div>
    22. 括号生成
    数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
    示例 1：
    输入：n = 3
    输出：["((()))","(()())","(())()","()(())","()()()"]
    示例 2：
    输入：n = 1
    输出：["()"]
    提示：
    1 <= n <= 8
  </div>
  <div>
    39. 滑动窗口最大值
    给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
    返回 滑动窗口中的最大值 。
    示例 1：
    输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
    输出：[3,3,5,5,6,7]
    解释：
    滑动窗口的位置 最大值
    --------------- -----
    [1 3 -1] -3 5 3 6 7 3
    1 [3 -1 -3] 5 3 6 7 3
    1 3 [-1 -3 5] 3 6 7 5
    1 3 -1 [-3 5 3] 6 7 5
    1 3 -1 -3 [5 3 6] 7 6
    1 3 -1 -3 5 [3 6 7] 7
    示例 2：

    输入：nums = [1], k = 1
    输出：[1]
    提示：
    1 <= nums.length <= 10^5
    -10^4 <= nums[i] <= 10^4
    1 <= k <= nums.length
  </div>
  <div>
    283. 移动零
    给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
    请注意 ，必须在不复制数组的情况下原地对数组进行操作。
    示例 1:
    输入: nums = [0,1,0,3,12]
    输出: [1,3,12,0,0]
    示例 2:
    输入: nums = [0]
    输出: [0]
    提示:
    1 <= nums.length <= 10^4
    -2^31 <= nums[i] <= 2^31 - 1
  </div>
  <div>
    279. 完全平方数
    给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
    完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。
    示例 1：
    输入：n = 12
    输出：3
    解释：12 = 4 + 4 + 4
    示例 2：

    输入：n = 13
    输出：2
    解释：13 = 4 + 9
    提示：
    1 <= n <= 10^4
  </div>
</template>

<script>
export default {
  name: "7_18",
  created() {
    console.log(this.code279(12));
  },
  methods: {
    /**
     * 思路
     * 动态规划
     * 第一个括号()
     * 下一个只能在任意括号后加括号然后去重
     * @param n
     * @returns {*}
     */
    code22(n) {

      let arr = [];
      arr[0] = ["()"];

      for (let i = 1; i < 8; i++) {
        let set = new Set();
        const last = arr[i - 1];
        const len = last.length;
        for (let j = 0; j < len; j++) {
          const str = last[j];

          for (let k = 0; k < str.length; k++) {
            const left = last[j].slice(0, k + 1);
            const right = last[j].slice(k + 1);
            set.add(left + "()" + right);
          }
        }
        arr[i] = Array.from(set);
      }
      return arr[n - 1];
    },
    code283(nums) {
      //0 1 0 3 12

      // 1 0 0 3 12
      let len = nums.length;
      let x = 0,  // 第一个0的位置
          y = 0;//第一个非0的index
      while (y < len) {
        if (nums[x] === 0 && nums[y] !== 0) {
          nums.splice(x, 0, nums[y])
          nums.splice(y + 1, 1);
          x += 1;
        } else if (nums[x] !== 0) {
          x += 1;
        }
        y++;
      }
      return nums;
    },
    code279(n) {

      const f = new Array(n + 1).fill(0);
      for (let i = 1; i <= n; i++) {
        let minn = 5;
        for (let j = 1; j * j <= i; j++) {
          minn = Math.min(minn, f[i - j * j]);
        }
        f[i] = minn + 1;
      }
      return f[n];
    }
  }
}
</script>

<style scoped>

</style>