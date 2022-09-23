import passport from 'passport'
import { config } from 'dotenv'
import { User } from '../../src/db/models'

// var GoogleTokenStrategy = require('passport-google-token').Strategy;

config()
// passport.use(new GoogleTokenStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,

// }, async (parsedToken, googleId, profile, done) => {

//     console.log("isi profile", profile)
//     try {
//         const existingGoogleAccount = await User.findOne({
//             where: { googleId: profile.id },
//         });

//         if (!existingGoogleAccount) {

//             const existingEmailAccount = await User.findOne({
//                 where: { email: getProfile(profile).email }
//             })

//             if (!existingEmailAccount) {

//                 const newAccount = await User.create(getProfile(profile))
//                 return done(null, newAccount)
//             }

//             return done(null, existingEmailAccount)
//         }

//         return done(null, existingGoogleAccount)

//     } catch (error) {
//         throw new Error(error)
//     }

// }))

var GoogleTokenStrategy = require('passport-google-id-token')

passport.use(
    new GoogleTokenStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        async (googleId, profile, done) => {
            // try {

            // const existingGoogleAccount = await User.findOne({
            //     where: { googleId: profile },
            // });

            // if (!existingGoogleAccount) {

            //     const existingEmailAccount = await User.findOne({
            //         where: { email: getProfile(googleId,req.query.isTutor).email }
            //     })

            //     if (!existingEmailAccount) {

            //         const newAccount = await User.create(getProfile(googleId,req.query.isTutor))
            //         return done(null, newAccount)
            //     }

            //     return done(null, existingEmailAccount)
            // }

            return done(null, googleId)

            // } catch (error) {
            //     throw new Error(error)
            // }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((user, done) => {
    User.findByPk(id)
        .then((user) => {
            done(null, user)
        })
        .catch((error) => done(error))
})
