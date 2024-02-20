const Post = require('../models/Posts');
const { mongooseToObject } = require('../../util/mongoose'); 

class NewsController {
    // [GET] /post/:slug
    show(req, res, next) {
        Post.findOne({slug: req.params.slug}) 
            .then(post => res.render('post/show', { post: mongooseToObject(post) }))
            .catch(next);
    }
    // [GET] /post/create
    create(req, res, next) {
        res.render('post/create');
    }
    // [POST] /post/store
    store(req, res, next) {
        const dataForm = req.body;
        dataForm.image = `https://img.youtube.com/vi/${dataForm.videoId}/hqdefault.jpg`;
        const post = new Post(dataForm);
        post.save();
        res.redirect('../me/stored/posts');
    }
    // [GET] /post/:id/edit
    edit(req, res, next) {
        Post.findById(req.params.id)
            .then((post) => res.render('post/edit', {
                post: mongooseToObject(post)
            }))
            .catch(next);
    }
    // [PUT] /post/:id
    update(req, res, next) {
        const query = { _id: `${req.params.id}` };
        Post.findOneAndUpdate(query, req.body)
            .then(() => res.redirect('../me/stored/posts'))
            .catch(next);
    }
    //  [DELETE] /post/:id/delete
    delete(req, res, next) {
        Post.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // [PATCH] /post/:id/restore  
    restore(req, res, next) {
        Post.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // [DELETE] /post/:id/destroy
    destroy(req, res, next) {
        Post.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // [POST] /post/handle-form-action
    handleFormAction(req, res, next) {
        switch(req.body.action) {
            case '1':
                Post.delete({_id: { $in: req.body.posts}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'error !!!'});
        }
    }
}

module.exports = new NewsController();

