<template>
  <div class="header" id="header">
    <div class="header-left">
      <img src="../assets/images/logo.png" alt="logo" />
      <span>View Builder </span>
    </div>
    <div class="header-center">
      <div>
        <dl>
          <dt>
            <i class="el-icon-document"></i>
          </dt>
          <dd>文本</dd>
        </dl>
        <dl>
          <dt>
            <i class="el-icon-picture"></i>
          </dt>
          <dd>图片</dd>
        </dl>
        <dl>
          <dt>
            <i class="el-icon-view"></i>
          </dt>
          <dd>视频</dd>
        </dl>
        <dl>
          <dt>
            <i class="el-icon-setting"></i>
          </dt>
          <dd>形状</dd>
        </dl>
        <dl>
          <dt>
            <i class="el-icon-menu"></i>
          </dt>
          <dd>扩展</dd>
        </dl>
      </div>
    </div>
    <div class="header-right">

    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'header'
}
</script>

<style scoped>
.header {
  height: 50px;
  background-color: #364e6a;
  line-height: 50px;
  color: #fff;
}

.header .header-left {
  display: inline-block;
  float: left;
  width: 250px;
}

.header .header-left img {
  vertical-align: sub;
  margin: 0 10px;
}

.header .header-center {
  display: inline-block;
  position: absolute;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  left: 250px;
  right: 400px;
}

.header .header-center div {
  margin: auto;
  position: absolute;
  left: 50%;
  margin-left: -165px;
}

.header .header-center dl {
  float: left;
  margin: -8px 21px;
  text-align: center;
}

.header .header-center dl:hover {
  color: #58B7FF;
}

.header .header-center dl dt {
  height: 17px;
}

.header .header-center dl dd {
  margin-left: 0;
}

.header .header-right {
  display: inline-block;
  float: right;
  width: 400px;
}
</style>
