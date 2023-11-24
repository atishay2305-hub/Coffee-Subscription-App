import { users } from '../Config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../validationChecker.js';
import bcrypt from 'bcrypt';

let exportMethods = {
    async createUser(firstName, lastName, username, DOB, email, password, preferences, preferredBlends, preferredGrindSize) {
        firstName = validation.checkLegitName(firstName, 'First Name');
        lastName = validation.checkLegitName(lastName, 'Last Name');
        username = validation.checkName(username, 'Username');
        DOB = validation.checkDOB(DOB, 'Date of Birth');
        email = validation.checkEmail(email, 'Email');
        password = validation.checkPassword(password, 'Password');

        preferences = {
            coffeeType: "Latte",
            milkPreference: "Whole milk",
            size: "Medium",
            flavorAddins: [],
            temperature: "Hot"
          };          

        preferredBlends = [
            "House Blend",
            "Colombian",
            "French Roast",
            "Vanilla Nut Blend",
          ];

        preferredGrindSize = ["Small", "Medium", "Large"]

          

        const userCollection = await users();
        const checkExist = await userCollection.findOne({ email: email });
        if (checkExist) throw "Sign in to this account or enter an email address that isn't already in use.";
        const checkUserNameExist = await userCollection.findOne({ username: username });
        if (checkUserNameExist) throw "Username already exists.";

        let user = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            DOB: DOB, // Changed semicolon to comma
            email: email,
            password: await bcrypt.hash(password, 10)
        };

        const insertInfo = await userCollection.insertOne(user);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user.";

        return { insertedUser: true, userID: insertInfo.insertedId.toString() };
    },

    async checkUser(email, password) {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);

        const userCollection = await users();
        const checkExist = await userCollection.findOne({ email: email });
        if (!checkExist) {
            throw "You may have entered a wrong email address or password.";
        }
        const checkPassword = await bcrypt.compare(
            password,
            checkExist.password
        );
        if (!checkPassword) throw "You may have entered the wrong email address or password.";

        return {
            firstName: checkExist.firstName,
            lastName: checkExist.lastName,
            username: checkExist.username,
            DOB: checkExist.DOB,
            email: checkExist.email,
            password: checkExist.password // Removed checkPassword.password, as it's not needed
        };
    },

    async updateUser(firstName, lastName, username, DOB, email, password) {
        firstName = validation.checkLegitName(firstName, 'First Name');
        lastName = validation.checkLegitName(lastName, 'Last Name');
        username = validation.checkName(username, 'Username');
        DOB = validation.checkDOB(DOB, 'Date of Birth');
        email = validation.checkEmail(email, 'Email');
        password = validation.checkPassword(password, 'Password');


        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        if (!user) {
            throw "You may have entered the wrong email or password.";
        }

        const checkPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!checkPassword) {
            throw "Cannot be the same as the original.";
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const updateInfo = await userCollection.updateOne(
            { email: email },
            {
                $set: {
                    password: hashPassword,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    DOB: DOB
                }
            }
        );

        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not update email ${email}`;
        }
        return { updatedUser: true, email: email };
    },

    async updatePassword(id, password){
        id = validation.checkId(id);
        password = validation.checkPassword(password);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if(!user){
            throw `Error: user {$id} does not exist.`
        }
        const updateInfo = await userCollection.updateOne(
            {_id: new ObjectId(user._id)},
            {$set: {password: await bcrypt.hash(password, 10)}}
        );

        
        let exportMethods = {
            async createUser(firstName, lastName, username, DOB, email, password) {
                firstName = validation.checkLegitName(firstName, 'First Name');
                lastName = validation.checkLegitName(lastName, 'Last Name');
                username = validation.checkName(username, 'Username');
                DOB = validation.checkDOB(DOB, 'Date of Birth');
                email = validation.checkEmail(email, 'Email');
                password = validation.checkPassword(password, 'Password');
        
                const userCollection = await users();
                const checkExist = await userCollection.findOne({ email: email });
                if (checkExist) throw "Sign in to this account or enter an email address that isn't already in use.";
                const checkUserNameExist = await userCollection.findOne({ username: username });
                if (checkUserNameExist) throw "Username already exists.";
        
                let user = {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    DOB: DOB, // Changed semicolon to comma
                    email: email,
                    password: await bcrypt.hash(password, 10)
                };
        
                const insertInfo = await userCollection.insertOne(user);
                if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user.";
        
                return { insertedUser: true, userID: insertInfo.insertedId.toString() };
            },
        
            async checkUser(email, password) {
                email = validation.checkEmail(email);
                password = validation.checkPassword(password);
        
                const userCollection = await users();
                const checkExist = await userCollection.findOne({ email: email });
                if (!checkExist) {
                    throw "You may have entered a wrong email address or password.";
                }
                const checkPassword = await bcrypt.compare(
                    password,
                    checkExist.password
                );
                if (!checkPassword) throw "You may have entered the wrong email address or password.";
        
                return {
                    firstName: checkExist.firstName,
                    lastName: checkExist.lastName,
                    username: checkExist.username,
                    DOB: checkExist.DOB,
                    email: checkExist.email,
                    password: checkExist.password // Removed checkPassword.password, as it's not needed
                };
            },
        
            async updateUser(firstName, lastName, username, DOB, email, password) {
                firstName = validation.firstName;
                lastName = validation.lastName;
                username = validation.username;
                DOB = validation.DOB;
                email = validation.email;
                password = validation.password;
        
                const userCollection = await users();
                const user = await userCollection.findOne({ email: email });
                if (!user) {
                    throw "You may have entered the wrong email or password.";
                }
        
                const checkPassword = await bcrypt.compare(
                    password,
                    user.password
                );
        
                if (!checkPassword) {
                    throw "Cannot be the same as the original.";
                }
        
                const hashPassword = await bcrypt.hash(password, 10);
                const updateInfo = await userCollection.updateOne(
                    { email: email },
                    {
                        $set: {
                            password: hashPassword,
                            firstName: firstName,
                            lastName: lastName,
                            username: username,
                            DOB: DOB
                        }
                    }
                );
        
                if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
                    throw `Error: could not update email ${email}`;
                }
                return { updatedUser: true, email: email };
            }
        };        
    },
    async removeUserById(userId) {
        userId = validation.checkId(userId);
        const userCollection = await users();
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw `Error: ${userId} not found`; //check password as well
        const deletionInfo = await userCollection.deleteOne({_id: new ObjectId(userId)});
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${userId}`;
        }
        return `The user ${user._id} has been successfully deleted!`;
    }
};

export default exportMethods;
