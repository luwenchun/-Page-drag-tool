<template>
  <div class="container">
    <wn-header></wn-header>
    <comp-view class="comp-container"></comp-view>
    <container-view></container-view>
    <comp-attr-view ref="attrView" class="attr-container"></comp-attr-view>
  </div>
</template>
<script>
import WnHeader from '../components/header.vue'
import CompView from './CompView'
import ContainerView from './ContainerView'
import CompAttrView from './CompAttrView'

export default {
  name: 'editorFrame',
  data() {
    return {
    }
  },
  components: {
    'comp-view': CompView,
    'wn-header': WnHeader,
    'container-view': ContainerView,
    'comp-attr-view': CompAttrView
  },
  mounted: function() {
  },
  methods: {

  }
}

</script>
<style>
html {
  height: 100%;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
}

.comp-container {
  display: inline-block;
  width: 250px;
  border-right: solid 1px #e0e0e0;
  position: absolute;
  top: 50px;
  bottom: 0;
  background-color: #243a54;
  color: #fff;
}

.attr-container {
  display: inline-block;
  width: 300px;
  border-left: solid 1px #e0e0e0;
  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  background-color: #223248;
  color: #FFF;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pull-right {
  float: right!important;
}

.widget-cate{
     display: inline-block;
    width: 25%;
    text-align: center;
    padding: 8px 0 10px 0;
    font-size: 14px;
    background-color: #243a54;
    border-top: 2px solid #ceb98d;
}
.save{
  margin-left: 5%;
}
form.el-form.el-form--label-left{
  margin-top: 20px;
}
form.el-form.el-form--label-left label.el-form-item__label{
      display: inline-block;
    padding-left: 5%;
    color: #fff;
}
 form.el-form.el-form--label-left .base .el-input, form.el-form.el-form--label-left .el-input__inner{
    width: 92%;
    display: inline-block;
  }
</style>
