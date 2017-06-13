// dao/userDao.js
// ʵ����MySQL����
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./typeSqlMapping');

// ʹ�����ӳأ���������
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// ��ǰ̨����JSON�����ļ򵥷�װ
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '����ʧ��'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	add: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			// ��ȡǰ̨ҳ�洫�����Ĳ���
			var param = req.query || req.params;

			// �������ӣ�����в���ֵ
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.insert, [param.type_name, param.type_parent], function(err, result) {
				if(result) {
					result = {
						code: 0,
						msg:'���ӳɹ�'
					};    
				}

				// ��json��ʽ���Ѳ���������ظ�ǰ̨ҳ��
				jsonWrite(res, result);

				// �ͷ����� 
				connection.release();
			});
		});
	},
	delete: function (req, res, next) {
		// delete by Id
		pool.getConnection(function(err, connection) {
			var id = +req.query.id;
			connection.query($sql.delete, id, function(err, result) {
				if(result.affectedRows > 0) {
					result = {
						code: 0,
						msg:'ɾ���ɹ�'
					};
				} else {
					result = void 0;
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	update: function (req, res, next) {
		// update by id
		// Ϊ�˼򵥣�Ҫ��ͬʱ��name��age��������
		var param = req.body;
		if(param.name == null || param.age == null || param.id == null) {
			jsonWrite(res, undefined);
			return;
		}

		pool.getConnection(function(err, connection) {
			connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
				// ʹ��ҳ�������ת��ʾ
				if(result.affectedRows > 0) {
					res.render('suc', {
						result: result
					}); // �ڶ�����������ֱ����jade��ʹ��
				} else {
					res.render('fail',  {
						result: result
					});
				}

				connection.release();
			});
		});

	},
	queryById: function (req, res, next) {
		var user_id = +req.query.id; // Ϊ��ƴ����ȷ��sql��䣬����Ҫת������
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryById, user_id, function(err, result) {
				jsonWrite(res, result);
				connection.release();

			});
		});
	},
	queryAll: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAll, function(err, result) {
                var resultData=result;
                if(result!==undefined){
                    resultData={
                        typeList:result,
                        code:0
                    };
                }
				jsonWrite(res, resultData);
				connection.release();
			});
		});
	},
    queryByFlow: function (req, res, next) {
        var type_flow = +req.query.type_flow;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByFlow,type_flow, function(err, result) {
                var resultData=result;
                if(result!==undefined){
                    resultData={
                        typeList:result,
                        code:0
                    };
                }
                jsonWrite(res, resultData);
                connection.release();
            });
        });
    }

};