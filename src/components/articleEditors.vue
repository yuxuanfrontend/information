<template lang="html">
  <div class="contright">
    <div class="artiletitlex">文章编辑</div>
    <div class="artiletable">
      <table>
        <tbody>
          <tr>
            <td width="10%"><span>*</span>文章标题</td>
            <td width="90%"><input type="text" name="" value="" placeholder="请输入文章标题" v-model="Title" ></td>
          </tr>
          <tr>
            <td><span>*</span>文章类型</td>
            <td>
              <p><input type="radio" name="1" :value="1" v-model="type"><span>原创</span></p>
              <p><input type="radio" name="1" :value="0" v-model="type"><span>第三方文章</span></p>
            </td>
          </tr>
          <tr v-show="type === 0">
            <td><span>*</span>原文链接</td>
            <td><input type="text" name="" value=""  placeholder="请输入原文链接" v-model="link"></td>
          </tr>
          <tr>
            <td><span>*</span>作者</td>
            <td><input type="text" name="" value="" placeholder="请输入作者" v-model="author"></td>
          </tr>
          <tr>
            <td>标签</td>
            <td>
              <div class="tagbox">
                <ul>
                  <li v-for="item in items" v-bind:class="{active:item.isActive}" v-on:click="toggleshow(item)">{{ item.label }}</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-show="type === 1">
            <td><span>*</span>文章详情</td>
            <td>
              <div id="editor"></div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">
              <button type="button" name="button" class="inputbtn active" v-on:click="release">发布</button>
              <button type="button" name="button" class="inputbtn" v-on:click="save" v-if="saveShow">保存草稿</button>
              <button type="button" name="button" class="inputbtn" @click="cancel">取消</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <popup v-if="showpopup" :popup="popup" @click-cancel="popupCancel" :click-assign="popupAssign" @click-save='saveassign' @click-canceleditor="canceleditor"></popup>
  </div>
</template>

<script>

import wangEditorcss from 'wangeditor/dist/css/wangEditor.css'
import jqueryjs from 'wangeditor/dist/js/lib/jquery-1.10.2.min.js'
window.jQuery = window.$ = jqueryjs
import wangEditor from 'wangeditor/dist/js/wangEditor.min.js'
import popup from './popup'

// var textarea = document.getElementById('editor');
// // 生成编辑器
// var editor = new wangEditor(textarea);
// editor.create();


export default {
  name : 'articleEditors',
  components:{
    popup
  },
  data () {
    return {
      Title : '',
      type: 1,
      link: '',
      author: '',
      popup:[
        {
          title:'',
          content:'',
          assignshow:false,
          saveshow:false,
          cancelshow:false
        }
      ],
      showpopup : false,
      items : [
        {
          label : '热门',
          isActive : false,
          code: 1
        },
        {
          label : '公告',
          isActive : false,
          code: 2
        }
      ],
      id: '',
      editor: {}
    }
  },

  computed: {
    choosedTagCode() {
      let code

      this.items.forEach((item) => {
        if (item.isActive) {
          code = item.code
        }
      })
      return code
    },
    updatingItem() {
      return this.$store.state.updatingItem
    },
    isUpdate() {
      return this.$store.state.isUpdate
    },
    saveShow(){
      if(this.$store.state.updatingItem.status===1){
        return false
      }else{
        return true
      }
    }
  },
  mounted() {
    // console.log(this.$store)
    // this.isUpdate = true
    // if (this.$route.query.editorTitle) {
    // }

    // alert(this.$route.query.editorLink);
    this.$nextTick(() => {
      this.editor = new wangEditor('editor')
      this.editor.config.uploadImgUrl = 'https://backend-api.yinli99.com/api/upload/files'
      this.editor.config.uploadHeaders = {
        'backend-user-token' : window.localStorage.token || ''
      };
      this.editor.config.uploadImgFileName = 'file'
      this.editor.config.uploadImgFns.onload = (resultText, xhr) => {
        let data = JSON.parse(resultText)
        let src = data.t
        // resultText 服务器端返回的text
        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        let originalName = editor.uploadImgOriginalName || '';

        // 如果 resultText 是图片的url地址，可以这样插入图片：
        this.editor.command(null, 'insertHtml', '<img src="' + src + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // 如果不想要 img 的 max-width 样式，也可以这样插入：
        // editor.command(null, 'InsertImage', resultText);
      };
      this.editor.config.menus = [
        'source',
        '|',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        // 'unorderlist',
        // 'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        // 'link',
        // 'unlink',
        // 'table',
        'emotion',
        '|',
        'img',
        // 'video',
        // 'location',
        // 'insertcode',
        '|',
        'undo',
        'redo',
        // 'fullscreen'
     ];
     this.editor.create();

     if (this.isUpdate) {
       this.Title = this.updatingItem.title
       this.type = this.updatingItem.type
       this.author = this.updatingItem.author
       this.link = this.updatingItem.content
       this.id = this.updatingItem.id
       this.editor.command(null, 'insertHtml', this.updatingItem.content);
       this.items.forEach((item) => {
         if (item.code === this.updatingItem.tag) {
           item.isActive = true
         }
       })
     }
    })
  },
  methods : {
    toggleshow : function(item){
      if (item.isActive) {
        item.isActive = !item.isActive
      } else {
        this.items.forEach((item) => {
          item.isActive = false
        })
        item.isActive = true
      }
    },
    release : function(){
      if(this.type === 1){
        if(this.Title === '' || this.author === '' || this.editor.$txt.html() === '<p><br></p>' ){
          this.Required()
        }else{
          this.showpopup = true
          this.popup.title = '发布文章'
          this.popup.content = '你确定要发布此原创文章么？'
          this.popup.assignshow = true
          this.popup.saveshow = false
          this.popup.cancelshow = false
        }
      }else if(this.type === 0){
        if(this.Title === '' || this.author === '' || this.link === '' ){
          this.Required()
        }else{
          this.showpopup = true
          this.popup.title = '发布文章'
          this.popup.content = '你确定要发布此第三方文章么？'
          this.popup.assignshow = true
          this.popup.saveshow = false
          this.popup.cancelshow = false
        }
      }
    },
    save : function(){
      if(this.type === 1){
        if(this.Title === '' || this.author === '' || this.editor.$txt.html() === '<p><br></p>' ){
          this.Required()
        }else{
          this.showpopup = true
          this.popup.title = '保存文章'
          this.popup.content = '你确定要保存此原创文章么？'
          this.popup.saveshow = true
          this.popup.assignshow = false
          this.popup.cancelshow = false
        }
      }else if(this.type === 0){
        if(this.Title === '' || this.author === '' || this.link === '' ){
          this.Required()
        }else{
          this.showpopup = true
          this.popup.title = '保存文章'
          this.popup.content = '你确定要保存此第三方文章么？'
          this.popup.saveshow = true
          this.popup.assignshow = false
          this.popup.cancelshow = false
        }
      }
      // if (this.isUpdate) {
      //   this.ajaxPatch(0)
      // } else {
      //   this.ajaxPost(0)
      // }
    },
    ajaxPost(status) {                                                                 //添加咨询数据到接口
      // console.log(this.updatingItem.publishDate || 'dlfen')
      // console.log((this.status === 1 ? this.dateFormat(Date.now()) : ''))
      this.$http.post('https://backend-api.yinli99.com/api/informations', {
        title: this.Title,
        type:this.type,
        content: this.type === 0 ? this.link : this.editor.$txt.html(),
        author: this.author,
        tag: this.choosedTagCode,
        status: status,
        publishDate:this.dateFormat(Date.now()),
        num:'-'
      }).then((res) => {
        this.$router.push({path:'/content/information'})                                                   //跳转到列表页
      })
    },
    ajaxPatch(status) {                                                                //接口数据更新
      this.$http.patch('https://backend-api.yinli99.com/api/informations', {
        title: this.Title,
        type:this.type,
        content: this.type === 0 ? this.link : this.editor.$txt.html(),
        author: this.author,
        tag: this.choosedTagCode,
        status: status,
        num:'-',
        publishDate:(this.updatingItem.status === 0 ? this.dateFormat(Date.now()) : this.updatingItem.publishDate),
        id: this.id
      }).then((res) => {
        this.$router.push({path:'/content/information'})
      })
    },
    cancel() {
      this.showpopup = true
      this.popup.title = '提示'
      this.popup.content = '你确定取消此次添加嘛？'
      this.popup.cancelshow = true
      this.popup.assignshow = false
      this.popup.saveshow = false
    },
    canceleditor(){
      this.popup.showpopup = false
      this.$router.push('/content/information')
    },
    dateFormat(value) {
      let add0 = function(m){
        return m<10?'0'+m:m
      }
      var time = new Date(value)
      var y = time.getFullYear()
      var m = time.getMonth()+1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      console.log(this)
      // return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s)
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
    },
    popupCancel(){                           //弹出框取消按钮
      this.showpopup = false
      return false
    },
    popupAssign(){                            ////弹出框确定进行下一步按钮
      this.showpopup = false
      if(this.isUpdate) {
        this.ajaxPatch(1)
      } else {
        this.ajaxPost(1)
      }
    },
    saveassign(){
      this.showpopup = false
      if(this.isUpdate) {
        this.ajaxPatch(0)
      } else {
        this.ajaxPost(0)
      }
    },
    Required(){
      this.showpopup = true
      this.popup.title = '提示'
      this.popup.content = '必填项不能为空!'
      this.popup.assignshow = false
      this.popup.saveshow = false
      this.popup.cancelshow = false
    }
  }
}
</script>
<style>
.artiletable .wangEditor-container .clearfix:after {
  display: block;
}

</style>
<style scoped>
.artiletitlex{
  padding: 10px 20px;
  background: #2c6ca2;
  text-align: left;
  color: #fff;
}
.active{
  background:#347ab6!important;
  color: #fff!important;
  border: none!important;
}


.artiletable{
  margin-top: 25px;
}
.artiletable table{
  width: 100%;
}
.artiletable table tbody tr td p{
  display: inline-block;
  padding: 0 12px;
}
.artiletable table tbody tr td:first-child{
  text-align: right;
}
.artiletable table tbody tr td:nth-child(2){
  text-align: left;
}
.artiletable table tbody tr td:first-child span{
  color: #c6010b;
}
.artiletable table tbody tr:last-child td:first-child{
  vertical-align: top;
}
.artiletable table tbody tr td input[type=text]{
  height: 28px;
  outline: none;
  width: 260px;
  text-indent: .5em;
  font-family: "微软雅黑"
}
.tagbox ul li{
  display: inline-block;
  width: 52px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  margin-right:10px;
  background: #dbdbdb;
  cursor: pointer;
  font-size: 14px;
}
.inputbtn{
  padding:8px 30px;
  border: 1px solid #dbdbdb;
  background: #fff;
  border-radius: 4px;
  color: #666;
  font-family: "微软雅黑";
  margin: 0 10px;
  outline: none;
  cursor: pointer;
}
.wangEditor-txt{
  height: 300px!important;
}
</style>
