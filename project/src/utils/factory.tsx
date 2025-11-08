import {ElButton, ElSelect, ElInput, ElCheckbox} from 'element-plus'

// 组件配置类型
type ButtonConfig = {
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  onClick: () => void;
};

type SelectConfig = {
  options: { label: string; value: any }[];
  placeholder?: string;
  onSelect: (value: any) => void;
};

type CheckboxConfig = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};
type InputConfig = {
  style: string,
  type: string,
  disabled: boolean,
  placeholder: string,
  vModel: string,
  clearable: boolean,
  onChange: (event: FocusEvent) => void
  onInput: (event: FocusEvent) => void
};

// ElementUI 组件工厂
export default class ElementFactory {
  static createButton(config: ButtonConfig) {
    return (
      <ElButton
        type={config.type || 'primary'}
        icon={config.icon}
        onClick={config.onClick}>
        {config.text}
      </ElButton>
    );
  }

  static createInput(config: InputConfig) {
    return (
      <ElInput type={config.type || 'primary'}
               v-model={config.vModel}
               style={config.style}
               disabled={config.disabled}
               placeholder={config.placeholder}
               clearable={config.clearable}
               onChange={config.onChange}
               onInput={config.onInput}>
      </ElInput>
    );
  }

  private fromConfig: any[]

  constructor(fromConfig: any[]) {
    this.fromConfig = fromConfig
  }

  getRender() {
    return this.fromConfig.map(m => {
      for (let key in m) {
        try {
          return ElementFactory[key](m[key])
        } catch (error) {
          console.log(error);
        }
      }
    })
  }
}