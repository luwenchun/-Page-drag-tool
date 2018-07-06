<template>
  <div >
    <ul class="set">
      <li >样式
      <ul class="base">
        <li><label >基础样式</label></li>
        <li><label >颜色：</label><wn-input v-model="input"  placeholder="请添加颜色"></wn-input></li>
        <li><label >长度：</label><wn-input v-model="input" placeholder="请添加长度"></wn-input></li>
        <li><label >颜色：</label><wn-input v-model="input"  placeholder="请添加颜色"></wn-input></li>
      </ul>
      </li>
      <li>触发
        <ul class="base">
          <li><label >事件</label></li>
          <li><label >单击：</label><wn-input v-model="input"  placeholder="请添加"></wn-input></li>
          <li><label >鼠标经过：</label><wn-input v-model="input" placeholder="请添加"></wn-input></li>
          <li><label >单击：</label><wn-input v-model="input"  placeholder="请添加"></wn-input></li>
        </ul>
      </li>
      <li>拓展
          <ul class="base">
          <li><label >基础属性</label></li>
          <li><label >默认激活：</label><wn-input v-model="input"  placeholder="请添加"></wn-input></li>
          <li><label >标签宽度：</label><wn-input v-model="input" placeholder="请添加"></wn-input></li>
          <li><label >标签高度：</label><wn-input v-model="input"  placeholder="请添加"></wn-input></li>
          </ul>
      </li>
    </ul>
  </div>

</template>

<script type="text/javascript">
  export default {
    data() {
    return {
      input: ' '
    }
  }
  }
</script>

<style scoped>

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

  }
  .set{
    position: relative;

  }
   .set>li{
    float: left;
    width: 25%;
    text-align: center;
    padding:8px 0 10px 0;
    border-top: 2px solid transparent;
    font-size: 14px;
  }
  .set >li:nth-child(1) .base{
    display: block;
  }
   .set >li:nth-child(3){
    background-color:#243a54;
    border-top: 2px solid #ceb98d;
   }
   .set >li:hover{
  background-color:#243a54;
  border-top: 2px solid #ceb98d;
  }
  .set >li:hover~li{
    background-color:transparent;
    border-top: 2px solid transparent;
  }
  .set >li:hover .base{
    display: block;
  }
  .set .base{
   position: absolute;
    width: 100%;
    opacity: 1;
    display: none;
    left:0;
    top: 40px;
  }
  .base>li{
    width: 100%;
    text-align: left;
    padding: 10px 0;
    font-size: 12px;
    background-color: #3e5068;
    padding-bottom: 0;
  }
  .base>li label{
    display: inline-block;
    width: 23%;
    padding-left: 5%;
  }
  .base>li:nth-child(1){
   font-size: 14px;
    background-color: #243a54;
    padding: 11px 0;
  }
  .base>li:nth-last-child(1){
    padding-bottom: 10px;
  }
  .base .el-input, .el-input__inner{
    width: 68%;
    display: inline-block;
  }
</style>
