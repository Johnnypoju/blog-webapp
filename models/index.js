const Blog = require('./blog');
const User = require('./user');
const Reading_list = require('./reading_list');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading_list, as: 'readings'});
Blog.belongsToMany(User, { through: Reading_list, as: 'read' });


module.exports = {
    Blog, User, Reading_list
}