const xss = require('xss')
const { exec, escape } = require('../db/mysql')

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}'`
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }

  sql += `order by createtime desc`
  return await exec(sql)
}

const getDetail = async id => {
  const sql = `select * from blogs where id='${id}' `
  return await exec(sql)
}

const newBlog = async (blogData = {}) => {
  const title = escape(xss(blogData.title))
  const content = escape(xss(blogData.content))
  const author = blogData.author
  const createtime = Date.now()

  const sql = `insert into blogs (title, content, createtime, author) 
                values (${title}, ${content}, ${createtime}, ${author})`

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const updateBlog = async (id, blogData = {}) => {
  const title = escape(xss(blogData.title))
  const content = escape(xss(blogData.content))

  const sql = `update blogs set title = ${title}, content = ${content} where id=${id}`

  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}

const delBlog = async (id, author) => {
  const sql = `delete from  blogs where id=${id} and author='${author}'`

  const delBlog = await exec(sql)
  if (delBlog.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
