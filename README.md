# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## problems found

- the module of react-router-dom should use "require" to import

## 设置路径别名

- 在根目录下创建 paths.json 文件，内容如下：

```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- 在 tsconfig.json 中配置 extends 引入上面创建的 paths.json 文件

```
{
  "compilerOptions":{
    ...

    "extends": "./paths.json"
  }
}
```
### 一些问题
 - ant的menu设置openKeys和defaultOpenKeys智能二选一，一旦设置了openKeys，手动展开菜单将会失效，需要结合onOpenChange手动控制
 - 图片放在public里
 - 上传组件的onRemove回调里要 return false，否则会出现提交表单时图片没有移除，还变成了file对象类型的值。(没找到原因...)
 - 自定义hook里定义的对象类型设置为any，否则会出现ts报错，property xxx does not exits on type xxx
 - 富文本组件RichText在onChange的时候传回父组件的值是EditorState类型的对象，需要在表单提交的时候调用toHTML()转成HTML。（尝试过在   RichText组件onChange先调用toHTML()后再传回父组件，但再配合BraftEditor.createEditorState时会有其他问题。。。）