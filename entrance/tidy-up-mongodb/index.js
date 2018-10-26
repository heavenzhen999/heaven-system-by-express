/*
 * @Author: chen zhen
 * @Date: 2018-05-30 08:48:48
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 13:21:57
 * @Description: 国泰星云 - 青岛北斗云项目 由于之前数据存储方案的问题，遂将数据进行赋值分离
 *               当前PositionEx的数据为452198条，目前只处理包含2018/5/27号以及之前的所有数据 
 * 
 *               DJK 3892365  3892次
 */
var tools = require('../../utils')
var mongoose = require('../../database/mongodb/db.js');
var Schema = mongoose.Schema;

const PositionExOption = {
  tml_id: String,
  vehicle_id: Number,
  gpsmode: Number,
  longitude: Number,
  latitude: Number,
  speed: Number,
  direction: Number,
  data: String,
  satelitenum: Number,
  differtime: Number,
  location: String,
  state: String,
  oil: Number,
  carry: Number,
  route_id: String,
  driver_id: String,
  protocol_id: Number,
  ipaddr_dw: String,
  msg_seq: Number,
  value: String,
  systemtime: Date
}

const PositionOutExOption = {
  tml_id: String,
  vehicle_id: Number,
  gpsmode: Number,
  longitude: Number,
  latitude: Number,
  speed: Number,
  direction: Number,
  data: String,
  satelitenum: Number,
  differtime: Number,
  location: String,
  state: String,
  oil: Number,
  carry: Number,
  route_id: String,
  driver_id: String,
  protocol_id: Number,
  ipaddr_dw: String,
  msg_seq: Number,
  value: String,
  systemtime: Date
}

const DJKOption = {
  GPSTIME: Date,
  LONGITUDE: Number,
  LATITUDE: Number,
  SPEED: Number,
  DIRECTION: Number,
  GPSMODE: Number,
  SATELITENUM: Number,
  DIFFERTIME: Number,
  SYSTEMTIME: String,
  TML_ID: Number,
  VEHICLE_ID: Number
}

const JX2DOption = {
  VEHICLE_ID: Number,
  DATA: String,
  LONGITUDE: Number,
  LATITUDE: Number,
  SPEED: Number,
  DIRECTION: Number,
  SATELITENUM: Number,
  DIFFERTIME: Number,
  GPSMODE: Number,
  GPSTIME: String,
  SYSTEMTIME: String,
  TML_ID: Number,
}

const TYPE = 'JX2D' // 'IN' 'OUT' 'DJK' 'JX2D'
const ONCENUM = 1000 // 每次进行读取的数据两

const basePositionExSchema = new Schema(PositionExOption, { collection: 'PositionEx'});
const basePositionExModel = mongoose.model('PositionEx', basePositionExSchema)

const basePositionOutExSchema = new Schema(PositionOutExOption, { collection: 'PositionOutEx'});
const basePositionOutExModel = mongoose.model('PositionOutEx', basePositionOutExSchema)

const baseDJKSchema = new Schema(DJKOption, { collection: 'DJK'});
const baseDJKModel = mongoose.model('DJK', baseDJKSchema)

const baseJX2DSchema = new Schema(JX2DOption, { collection: 'JiXie2Dui'});
const baseJX2DModel = mongoose.model('JiXie2Dui', baseJX2DSchema)

const ModelAndSchema = {}

let _continue = true 
let times = 0

let start = null
let end = null

const center = () => {
  if (times === 0) {
    start = new Date()
  }
  // 先进行获取
  find((arr) => {
    //TODO 如果长度小于1000 则不进行下次循环
    // 过滤时间不对的数据
    // arr.filter(i => {
    //   if (i.systemtime >= new Date('2018-05-28 00:00:00')) return  false
    //   return true
    // })

    if (arr.length < 100) {
      _continue = false
      end = new Date()
    }

    
    
    let startTime = new Date()
    times += 1

    console.log(`(第${times}批次)开始查询,数据长度为: ${arr.length}, 时间:${tools.format(startTime, 'YYYY-MM-DD hh:mm:ss')}`)

    arr = arr.map((item, index) => {
      // 分批次进行保存
      return save(item, index)
    })
    // then(deleteE).
    Promise.all(arr).then(deleteE).then(res => {
      let endTime = new Date()
      console.log(`(第${times}批次)操作完成，时间: ${tools.format(endTime, 'YYYY-MM-DD hh:mm:ss')}, 共花费：${endTime.getTime() - startTime.getTime()}`)

      //每次最多1000次
      if (times >= 10) {
        _continue = false
        times = 0
        end = new Date()
        console.log(`共花费：${end.getTime() - start.getTime()}ms`)
      }
      
      // console.log(res)
      if (_continue) {
        return (() => {
          // 再次执行
          center()
        })()
      }
    }).catch((error) => {
      console.error(error)
    })
  })

}

const find = (callback) => {
  let startTime = new Date()
  // basePositionExModel
  let modle
  let searObj
  if (TYPE === 'IN') {
    modle = basePositionExModel
    searObj = {systemtime: {'$lte': new Date('2018-05-28 00:00:00')}}
  } else if (TYPE === 'OUT') {
    modle = basePositionOutExModel
    searObj = {systemtime: {'$lte': new Date('2018-05-28 00:00:00')}}
  } else if (TYPE === 'DJK') {
    modle = baseDJKModel
    searObj = {'SYSTEMTIME': {'$lte': '2018-05-28 00:00:00'}}
  } else if (TYPE === 'JX2D') {
    modle = baseJX2DModel
    searObj = {'SYSTEMTIME': {'$lte': '2018-05-28 00:00:00'}}
  }

  modle.find(searObj, (err, docs) => {
    let endTime = new Date()
    console.log(`((第${times}批次)成功)查询成功,话费时间为：${endTime.getTime() - startTime.getTime()}`)
    callback(docs)
  }).limit(ONCENUM)
}

const save = (info, index) => {
  return new Promise((res, rej) => {
    let _id = info._id
    let o = info._doc
    delete o._id
    let date
    if (TYPE === 'IN' || TYPE === 'OUT') {
      date = tools.format(o.systemtime, '_YYYY_MM_DD')
    } else if (TYPE === 'DJK') {
      date = o.SYSTEMTIME.substr(0, 10).replace(/-/g, '_')
      date = '_' + date
    } else if (TYPE === 'JX2D') {
      date = o.SYSTEMTIME.substr(0, 10).replace(/-/g, '_')
      date = '_' + date
      // 对机械2对的数据 需要对GPSTIME的数据进行整理
      o.GPSTIME = o.GPSTIME.substr(0, 19)
    }
    
    // 获取对应的modle
    let model
    if (TYPE === 'IN') {
      model = getPositionExMongoDBModel(date)
    } else if (TYPE === 'OUT') {
      model = getPositionOutExMongoDBModel(date)
    } else if (TYPE === 'DJK') {
      model = getDJKMongoDBModel(date)
    } else if (TYPE === 'JX2D') {
      model = getJX2DMongoDBModel(date)
    }

    const positionEx = new model(o)
    positionEx.save((err, docs) => {
      if (err) rej(err)
      console.log(`((第${times}批次)成功)保存成功：第${(index+1)}个, id：${docs.id}`)
      res({
        id: _id,
        info: docs
      })
    })
  })
}

const deleteE = (infos) => {
  // 都保存成功了，然后进行删除操作
  console.log(`((第${times}批次)成功)开始删除操作`)
  let ids = infos.map(i => {
    return i.id
  })

  let model
  if (TYPE === 'IN') {
    model = basePositionExModel
  } else if (TYPE === 'OUT') {
    model = basePositionOutExModel
  } else if (TYPE === 'DJK') {
    model = baseDJKModel
  } else if (TYPE === 'JX2D') {
    model = baseJX2DModel
  }

  return new Promise((res, rej) => {
    model.remove({
      _id: {
        '$in': ids
      }
    }, (err, docs) => {
      if (err) rej(err)
      console.log(`((第${times}批次)成功)删除成功`)
      res(docs)
    })
  })
}

const getPositionExMongoDBModel = (date) => {
  if (ModelAndSchema[date] === undefined) {
    let o = {}
    o.schema = new Schema(PositionExOption, { collection: `PositionEx${date}`});
    o.model = mongoose.model(`PositionEx${date}`, o.schema)
    ModelAndSchema[date] = o
  }
  return ModelAndSchema[date].model
}

const getPositionOutExMongoDBModel = (date) => {
  if (ModelAndSchema[date] === undefined) {
    let o = {}
    o.schema = new Schema(PositionOutExOption, { collection: `PositionOutEx${date}`});
    o.model = mongoose.model(`PositionOutEx${date}`, o.schema)
    ModelAndSchema[date] = o
  }
  return ModelAndSchema[date].model
}

const getDJKMongoDBModel = (date) => {
  if (ModelAndSchema[date] === undefined) {
    let o = {}
    o.schema = new Schema(DJKOption, { collection: `DJK${date}`});
    o.model = mongoose.model(`DJK${date}`, o.schema)
    ModelAndSchema[date] = o
  }
  return ModelAndSchema[date].model
}

const getJX2DMongoDBModel = (date) => {
  if (ModelAndSchema[date] === undefined) {
    let o = {}
    o.schema = new Schema(JX2DOption, { collection: `JiXie2Dui${date}`});
    o.model = mongoose.model(`JiXie2Dui${date}`, o.schema)
    ModelAndSchema[date] = o
  }
  return ModelAndSchema[date].model
}

// const center = () => {
//   // 第一步：读取数据(分批次多次读取数据)(暂时设定，一次读取100条数据)
  
//   // 先进行读取PositionEx的数据

//   basePositionExModel.find({}, (err1, docs1) => {
//     if(err1) console.log(err1);
//     console.log('查询成功');
//     docs1.forEach(i => {
//       if (i.systemtime >= new Date('2018-05-28 00:00:00')) {
//         return false
//       }
//       let _id = i._id
//       let o = i._doc
//       delete o._id
//       let date = tools.format(o.systemtime, '_YYYY_MM_DD')
//       const PositionExSchema = new Schema(PositionExOption, { collection: `PositionEx${date}`});
//       const PositionExModel = mongoose.model(`PositionEx${date}`, PositionExSchema)
//       const positionEx = new PositionExModel(o)
//       positionEx.save((err2, docs2) => {
//         if(err2) console.log(err2);
//         console.log('存储成功');

//         // 删除对应的数据
//         basePositionExModel.findByIdAndRemove(_id, (err3, docs3) => {
//           if(err3) console.log(err3);
//           console.log('删除成功')
//         })
//       })
//     })
//   }).limit(ONCENUM)
  
  
//   // 第二步：将数据进行重新保存在新的collection内部
  
//   // 第三步：将此次读取的数据进行删除
// }

module.exports = center
