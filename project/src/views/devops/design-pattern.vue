<script>
import Factory from "../../utils/factory";
import {reactive, ref} from "vue"

export default {
  setup() {
    // 使用数组返回多个根节点
    const formModel = reactive({
      name: ""
    })
    const formConfig = [{
      createInput: {
        placeholder: "Please input",
        style: "width: 240px"
      }
    }, {
      createButton: {
        text: "点我1",
        type: 'primary',
        icon: "",
        onClick: () => {
          console.log(1);
        }
      }
    }]
    const fac = new Factory(formConfig);
    console.log(fac.getRender());
    return () => fac.getRender();
  }
}

</script>

<style scoped>

</style>