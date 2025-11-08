// 全局方法

export const changeMenuIndex = (menus: object[], index: string | undefined) => {

  function change(arr, index) {
    if (!arr.length) {
      return undefined;
    }
    arr = arr.map((menu, menuIndex) => ({
      path: menu.path,
      name: menu.name,
      index: index ? index + "_" + menuIndex : menuIndex + "",
      title: menu.meta.title,
      children: change(menu.children || [], menuIndex)
    }))
    return arr
  }

  let result = change(menus, index)
  return result;
}

export const getMenuTitle = (menus: object[], key: string[]): any => {
  let result = [];

  for (let i = 0; i < key.length; i++) {
    getTitle(menus, key[i]);
  }

  function getTitle(arr: object[], key: string) {
    if (!arr.length) {
      return;
    }
    arr.forEach(f => {
      if (f.index === key) {
        result.push(f.title);
      }
      if (f.children && f.children.length) {
        getTitle(f.children, key);
      }
    })
  }

  return result;
}

export const getMenuName = (menus: object[], key: string[]): any => {
  let result = [];

  for (let i = 0; i < key.length; i++) {
    getName(menus, key[i]);
  }

  function getName(arr: object[], key: string) {
    if (!arr.length) {
      return;
    }
    arr.forEach(f => {
      if (f.index === key) {
        result.push(f.name);
      }
      if (f.children && f.children.length) {
        getName(f.children, key);
      }
    })
  }

  return result;
}

export const getMenuPath = (menus: object[], key: string[]): string => {
  let result = [];

  for (let i = 0; i < key.length; i++) {
    getPath(menus, key[i]);
  }

  function getPath(arr: object[], key: string) {
    if (!arr.length) {
      return;
    }
    arr.forEach(f => {
      if (f.index === key) {
        result.push(f.path);
      }
      if (f.children && f.children.length) {
        getPath(f.children, key);
      }
    })
  }

  return result.reduce((prev, cur, index) => {
    if (index === 0) return cur;
    else return prev + cur;
  }, "");
}