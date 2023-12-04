/*
 * @Author: JinXueJun jinxuejun@wondersgroup.com
 * @Date: 2023-12-04 09:40:08
 * @LastEditors: JinXueJun jinxuejun@wondersgroup.com
 * @LastEditTime: 2023-12-04 09:51:29
 * @FilePath: \cornerstone3D-React\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import './App.css'
import useCornnerstone from './useCornnerstone';

function App() {

  const {handleFileChange} =useCornnerstone()

  return (
    <>
      <input
    type="file"
    id="selectFile"
    onChange={handleFileChange}
  />
  <div id="content"></div>
    </>
  )
}

export default App
