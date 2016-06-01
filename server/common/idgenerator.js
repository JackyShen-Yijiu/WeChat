var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 自增ID生成器
var IdGenerator = new Schema({
    modelname: String,
    currentid: { type: Number, default: 1 }
});
mongoose.model('IdGenerator', IdGenerator);
var idg = mongoose.model('IdGenerator');

// 获得一个自增ID的方法
idg.getNewID = function(modelName, callback) {
    this.findOne({
        modelname: modelName
    }, function(err, doc) {
        if (doc) {
            doc.currentid += 1;
        } else {
            doc = new idg();
            doc.modelname = modelName;
        }
        doc.save(function(err) {
            if (err) throw err('IdGenerator.getNewID.save() error');
            else callback(parseInt(doc.currentid.toString()));
        });
    });
}

module.exports = idg;
