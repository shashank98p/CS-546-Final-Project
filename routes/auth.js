import {Router} from 'express';
import moment from 'moment';
//import {userData} from '../data/index.js';
//import { userData } from '../data/index.js';
import userData from '../data/users.js';
import postData from '../data/posts.js';
import validation from '../validationchecker.js';
//import { requireAuth } from '../app.js';
const router = Router();

router.route('/').get(async(req,res)=>{
    return res.status(200).render('login',{title:"Home Page"});
});

router.route('/login').get(async(req,res)=>{
    return res.status(200).render('login',{title:"login Page"});
});

router.route('/login').post(async(req,res)=>{
    try{

        let {emailAddressInput,passwordInput} = req.body;
        emailAddressInput = validation.checkEmail(emailAddressInput);
        passwordInput = validation.checkPassword(passwordInput);

        const {sessionUser} = await userData.checkUser(emailAddressInput,passwordInput);
        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        return res.redirect('/homepage');
    }catch(e){
        console.log(e);
        return res.redirect('/register');
    }
});

router.route('/register').get(async(req,res)=>{
    return res.status(200).render('register',{title:"Register Page"});
});

router.route('/register').post(async(req,res)=>{
    try{
        // removed dept
        const {firstName,lastName,userName,email,password,DOB, dept} = req.body;
        /*try{
            firstname = validation.checkString(firstname, 'First name');
            lastname = validation.checkString(lastname, 'Last name');
            email = validation.checkString(email, 'email');
            password = validation.checkString(psw, 'Password');
            dob = validation.checkString(dob, 'date of birth');
            department = validation.checkString(dept, 'department');
            validation.emailValidation(email);
        }catch(e){
            console.log(e);
            return res.status(400).send(e); 
        }*/
        const date = moment(DOB).format('MM-DD-YYYY');
        //const user = await userData.createUser(firstname,lastname,username,email,psw,date,dept);
        //console.log(user);
        //const {sessionUser} = await userData.;
        const user  = await userData.createUser(firstName,lastName,userName,email,password,DOB, dept);
        console.log(user);
        if(user.createUser)
        {
            return res.redirect('/login');
        }

        req.session.userId = sessionUser.userId;
        req.session.userName = sessionUser.userName;
        console.log(req.session.userId);
        console.log(req.session.userName);
        return res.redirect('/homepage');
        //return res.json(newuser);
    }catch(e){
        console.log(e);
        return res.redirect('/register'); 
    }
});



router.route('/homepage').get(async(req,res)=>{
    const userId = req.session.userId;
    //const email = req.session.email;    
    //useremail from session and will just keep it
    //const user = await userData.getUserByID(userId);
    //const postList = await userData.getPostList(user.email);

  
    //user info from ID
    //getpost list if true 
    const userName = req.session.userName;
    console.log(userName);
    //console.log(postList);
    const postList = await postData.getAllPosts();

    //console.log(postList);
    for (let x of postList){
        let resId = x?.userId;
       
        console.log(resId);
        
        let resString= resId.toString();

        const user = await userData.getUserByID(resString);
        x.name =user.userName;
        //console.log(user.userName);
        //console.log(resString);
        //console.log(x.userName);
        if(resString === userId){
            x.editable =true;
            x.deletable = true;
        }else{
            x.editable = false;
            x.deletable = false;
        }
    }
    //console.log(postList);
    
    //loop through the post and implement following logic[array]
    //List of posts and indiviudal post.UsedId = sesstion ID[add property editable or deletable false/true]
    //handlebars array of posts if button 
    return res.render('homepage',{userId:userId,userName:userName,posts:postList});

});


router.route('/profile').get(async(req,res)=> {
    const id = req.session.userId;
    console.log(id);
    const user = await userData.getUserByID(id);
    res.render('profile',{user:user});
});

router.route('/posts').get(async(req, res)=>{

    res.render('posts');
  });

router.route('/posts').post(async(req,res)=>{

    const id = req.session.userId;
    console.log(id);
    const userName = req.session.userName;

    const{postCategory,postContent} = req.body;
    console.log(postContent);
    try{
        const post = await postData.createPost(postCategory,postContent,id);
        const user  = await userData.putPost(id,post._id);
        console.log(user);
        console.log(post);
        console.log("The post is posted");
        res.redirect('/homepage');
    }catch(e){
        console.log(e)
        res.render('posts',{Error:e});
    }

});
router.route('/posts/:id').delete(async(req,res)=>{
    console.log(req.params.id);
    
    const response = await postData.removeById(req.params.id);
    console.log("hi",response.deleted);
    //const user = await userData.removePost()
    //const postList = await postData.getAllPosts();
    //res.status(200).send(response);

    //res.send(response);
    return res.sendStatus(200);

});


export default router;