<template lang="html">
  <div class="contright">
    <div class="statebox">
      <div class="state">
        <strong>状态:</strong>
        <!-- <input type="radio" name="1" value="">
        <span>全部</span> -->
        <input type="radio" name="1" :value="1" v-model="status" @change="changeStatus">
        <span>已发布</span>
        <input type="radio" name="1" :value="0" v-model="status" @change="changeStatus">
        <span>草稿</span>
        <a href="#" class="addbtn" @click.prevent="addArticle">添加</a>
        <!-- <router-link to="/articleeditors" class="addbtn">添加</router-link> -->
      </div>
    </div>
    <div class="infotitle">
      <input type="text" name="" placeholder="文章标题" value="" v-model="articleTitle">
      <date-picker field="myDate" placeholder="开始日期" v-model="begin" format="yyyy-mm-dd"></date-picker>
      <span>至</span>
      <date-picker field="myDate" placeholder="结束日期" v-model="end" format="yyyy-mm-dd"></date-picker>
      <button type="button" name="button" v-on:click="searchArticle">搜索</button>
      <button type="button" name="button" v-on:click="resetbtn">清空</button>
    </div>
    <div class="infotable">
      <table border="0">
        <thead>
          <tr>
            <td width="36%">标题</td>
            <td width="12%">标签</td>
            <td width="12%">状态</td>
            <td width="15%">发布时间</td>
            <td width="10%">阅读次数</td>
            <td width="15%">操作</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <td>{{ item.title }}</td>
            <td>{{ item.tag === 0 ? '' : item.tag === 1 ? '热门':'公告' }}</td>
            <td>{{ item.status === 1 ? '已发布':'草稿' }}</td>
            <td>{{ item.publishDate | dateFormat}}</td>
            <td>{{ item.realNum }}</td>
            <td><a @click.prevent="goEditors(index)">编辑</a><a v-on:click="deleteTr(index)">删除</a></td>
          </tr>
          <tr v-if="notxt">
            <td colspan="7">
              <p class="notxt">没有找到您想要的数据！</p>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="showPage">
            <td colspan="7">
              <ul class="pagination">
									<li @click="prevPage">
										<a><span>上一页</span></a>
									</li>
									<li v-for="(n,index) in pageNums" @click='goPage(n)'  >
										<a :class="{'pagecurrent': n === pageCurrent}">{{n}}</a>
									</li>
									<li @click="nextPage">
										<a><span>下一页</span></a>
									</li>
									<!-- <li>
										<span>共{{ pages }}页</span>
									</li> -->
									<!-- <li>
										<span class="pagetxt"><input type="text"v-model="value" placeholder="请输入页数" /></span>
									</li> -->
									<!-- <li>
										<span class="pagebtn"><button v-on:click="Searchbtn()">搜索</button></span>
									</li> -->
								</ul>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <popup v-if="showpopup" :popup="popup" @click-cancel="popupCancel"  @click-canceleditor="canceleditor"></popup>
  </div>
</template>

<script>
import popup from './popup'
import 'babel-polyfill' ; //因为使用了es6的一些方法，需要babel垫片，如果你项目中已有相关兼容性方案，可忽略
import myDatepicker from 'vue-datepicker-simple/datepicker-2.vue';

export default {
  name : 'information',
  components:{
    popup,
    'date-picker': myDatepicker
  },
  data () {
    return {
      articleTitle:'',
      status:1,
      items :[],
      begin:'',
      end: '',
      pageOffset: 0,
      pageSize: 10,
      pageNums: 1,
      showPage:true,
      notxt:false,
      popup:[
        {
          title:'',
          content:'',
          cancelshow:false
        }
      ],
      showpopup : false,
      clickDeleteIndex : 0
      // pageCurrent: 1
    }
  },
  computed: {
    pageCurrent() {
      return this.pageOffset / this.pageSize + 1
    }
  },
  mounted(){
    // this.$http.get('https://backend-api.yinli99.com/api/informations', {
    //   params: {
    //     status:this.status,
    //     offset:this.pageOffset,
    //     size: this.size,
    //   }
    // }).then((res) => {
    //   this.items = res.body.t.data
    //   this.pageNums = Math.ceil(res.body.t.count / this.size)
    // }, (err) => {
    //   console.log(1111)
    // })
    this.ajaxGetList()

  },
  methods : {
    ajaxGetList(callback) {
      this.$http.get('https://backend-api.yinli99.com/api/informations', {
        params: {
          status:this.status,
          offset:this.pageOffset,
          size: this.pageSize,
          title: this.articleTitle,
          startTime: this.begin && (this.begin + ' 00:00:00'),
          endTime: this.end && (this.end + ' 23:59:59')
        }
      }).then((res) => {
        this.items = res.body.t.data
        this.pageNums = Math.ceil(res.body.t.count / this.pageSize)
        if(res.body.t.count <= 10 && res.body.t.count > 0){
          this.showPage = true
          this.notxt = false
        }else if(res.body.t.count === 0){
          this.notxt = true
          this.showPage = false
        }else if(res.body.t.count > 10){
          this.notxt = false
          this.showPage = true
        }
        callback && callback(res)
      }, (err) => {
        console.log('error')
      })
    },
    changeStatus() {
      this.pageOffset = 0
      this.ajaxGetList()
    },
    deleteTr:function(i){                                                                 //删除当前列表项
      this.showpopup = true
      this.popup.title = '提示'
      this.popup.content = '你是否需要删除此项!'
      this.popup.assignshow = false
      this.popup.saveshow = false
      this.popup.cancelshow = true
      this.clickDeleteIndex = i
    },
    searchArticle() {
      if(this.articleTitle == '' && this.begin == '' && this.end == ''){
        return false
      }
      this.ajaxGetList()
    },
    goEditors(index) {
      console.log(this.status)
      this.$router.push('/content/articleeditors')
      this.$store.commit('setUpdatingItem', this.items[index])
      this.$store.commit('setIsUpdate', true)
    },
    addArticle() {
      this.$router.push('/content/articleeditors')
      this.$store.commit('setUpdatingItem', {})
      this.$store.commit('setIsUpdate', false)
    },
    goPage(n) {                                                 //点击当前页
      this.pageOffset = this.pageSize * (n - 1)
      this.ajaxGetList()
    },
    nextPage() {                                                  //下一页
      if (this.pageCurrent === this.pageNums) {
        return false
      }
      this.pageOffset += this.pageSize
      this.goPage(this.pageCurrent)
    },
    prevPage() {                                                        //上一页
      if (this.pageCurrent === 1) {
        return false
      }
      this.pageOffset -= this.pageSize
      this.goPage(this.pageCurrent)
    },
    resetbtn() {                                                             //清空表单  回到列表页
      if(this.articleTitle == '' && this.begin == '' && this.end == ''){
        return false
      }else{
        this.articleTitle = '',
        this.begin = '',
        this.end = ''
        this.ajaxGetList()
        this.goPage(1)
        this.notxt = false
        this.showPage = true
      }
    },
    popupCancel(){
      this.showpopup = false    //删除取消按钮
    },
    canceleditor(){            //删除确定按钮
        this.$http.delete('https://backend-api.yinli99.com/api/informations/' + this.items[this.clickDeleteIndex].id).then((res)=>{
        this.items.splice(this.clickDeleteIndex,1)
        this.$router.push('/content/information')
        this.showpopup = false
        this.ajaxGetList()
        this.goPage(1)
      })
    }
  },
  filters: {
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
      // return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s)
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
    }
  }
}
</script>

<style lang="css">
.infotable table thead tr td{
  background: #f3f3f3;
  padding: 15px 10px;
}
.infotable table{
  width: 100%;
}
.infotable table tr td{
  border:none;
  padding: 6px 10px;
  font-size: 14px;
}
.infotable table tbody tr td:nth-child(1){
  /*text-align: left;*/
}
.infotable table tr:nth-child(even){
  background:#f3f3f3;
}
.infotable table tbody tr td a,
.pagination li a{
  padding: 0 8px;
  cursor: pointer;
  color: #666;
}
.infotable table tbody tr td a{
  color: #347ab6;
}
.pagecurrent{
  background: #347ab6;
  color:#fff!important;
  border-radius: 3px;
}
.statebox{
  margin-top:15px;
}
.infotitle,.statebox{
  padding:15px 20px;
  text-align: left;
}
.infotitle input[type=text]{
  display: inline-block!important;
  color: #333;
  background: #f0f0f0;
  padding:10px 0;
  text-indent: .5em;
  height: 17px!important;
}
.vue-datepicker input[type=text]{
  width:140px!important;
  border:none!important;
}
.infotitle span{
  color: #999;
}
.state strong{
  font-size:16px;
  font-weight: normal;
}
.state span{
  font-size: 14px;
}
.state strong,.state span,.state input[type=checkbox]{
  margin-right:5px;
}
.infotitle button{
  cursor: pointer;
  padding: 10px 25px;
}
.infotitle button:hover{
  background:#2c6ca2;
}
.state .addbtn{
  padding: 5px 15px;
  float: right;
  font-size: 14px;
}
.infotitle button,.state .addbtn{
  background:#347ab6;
  color: #fff;
  border-radius: 3px;
}
.infotitle input[type=text],.infotitle button,.state .addbtn{
  font-family: "微软雅黑";
  border: none;
  outline: none;
}
.pagination {
  float: right;
  padding:0 20px;
}
.pagination li{
  float: left;
  padding: 10px 0;
}
.vue-datepicker{
  display: inline-block;
}
.notxt{
  padding: 25px 0;
}
</style>
