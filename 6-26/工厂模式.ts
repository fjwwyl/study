//工厂模式
/**
 * 对对象的创建和使用分离
 * 创建几个有相似功能的组件
 * 比如类型不同的按钮和表单
 */
class Input {
  type: string;
  placeholder: string;
}

class ClearableInput extends Input {
  clearable: boolean;

  constructor(clearable: boolean) {
    super();
    this.clearable = clearable;
  }
}

class DisabledInput extends Input {
  disabled: boolean;

  constructor(disabled: boolean) {
    super();
    this.disabled = disabled;
  }
}

function getInput(type: string, placeholder: string, style: string, disabled: boolean = false, clearable: boolean = false) {
  switch (style) {
    case "disabled":
      return new DisabledInput(disabled);
    case "clearable":
      return new ClearableInput(clearable);
    default:
      return new Error("type if error")
  }
}