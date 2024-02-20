const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const Post = require('../models/Posts');

class MeController {
    // [GET] /me/stored/posts
    storedPosts(req, res, next) { 
        let postsQuery = Post.find({});
        if(req.query.hasOwnProperty('_sort')) {
            postsQuery = postsQuery.sort({
                [req.query.column]: req.query.type
            });
        }
        Promise.all([postsQuery, Post.countDocumentsWithDeleted({ deleted : true })])
            .then(([posts, deletedCount]) => res.render('me/stored-posts', {
                posts: multipleMongooseToObject(posts),
                deletedCount,
            })
            )
            .catch(next);
    }
    // [GET] /me/trash/posts
    trashPosts(req, res, next) {
        Post.findWithDeleted({ deleted  : true })    // Use findWithDeleted not findDeleted because deleted post without method save (moongose-delete)
            .then(posts => res.render('me/trash', {
                posts: multipleMongooseToObject(posts)
            }))
            .catch(next);
    }
}

module.exports = new MeController();

