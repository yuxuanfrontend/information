<template lang="html">
  <div class="popupbox">
    <div class="popup">
      <div class="popuptitle">{{popup.title}}</div>
      <div class="popupcontent">{{popup.content}} </div>
      <div class="popupfoot">
        <button type="button" name="button" v-on:click="bolish">取消</button>
        <button type="button" name="button" class="blue" v-on:click="assign" v-if="popup.assignshow">确定</button> <!-- 确定进行下一步按钮-->
        <button type="button" name="button" class="blue" v-on:click="saveassign" v-if="popup.saveshow">确定</button> <!-- 确定进行下一步保存按钮-->
        <button type="button" name="button" class="blue" v-on:click="cancelassign" v-if="popup.cancelshow">确定</button><!-- 确定进行隐藏弹出框按钮-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'popup',
  data () {
    return {
      assignshow :false,
      saveshow :false,
      cancelshow:true
    }
  },
  props: ['popup', 'clickAssign'],
  methods:{
    bolish(){
      // this.showpopup = false
      this.$emit('click-cancel')
    },
    assign(){
      this.clickAssign()
      // this.$emit('click-assign')
    },
    saveassign(){
      this.$emit('click-save')
    },
    cancelassign(){
      this.$emit('click-canceleditor')
    }
  }
}
</script>

<style lang="css">
.popupbox{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: url(../assets/bg-shadow.png) repeat;
  z-index: 1000
}
.popup{
  width: 320px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -120px;
  margin-left: -160px;
  padding-bottom: 20px;
}
.popuptitle{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dbdbdb;
  font-size: 18px;
  font-family: "微软雅黑";
}
.popupcontent{
  padding: 20px;
  font-size: 14px;
}
.popupfoot{
  padding: 10px 0
}
.popupfoot button{
  font-family: "微软雅黑";
  padding: 6px 15px;
  margin:  0 10px;
  border-radius: 4px;
  border: none;
  color: #666;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}
.popupfoot button.blue{
  background: #347ab6;
  color: #fff;
}
</style>
