import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    backstory: {
        type: String,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    }
});

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        required: true
    },
    premise: {
        type: String,
        required: true
    },
    setting: {
        type: String,
        required: true
    },
    timePeriod: {
        type: String,
        required: true
    },
    characters: {
        type: [CharacterSchema],
        required: true
    },
    guidelines: {
        type: String,
        required: false
    },
    themes: {
        type: String,
        required: true
    },
    moral: {
        type: String,
        required: true
    },
    writingStyle: {
        type: String,
        required: true
    },
    wordCount: {
        type: Number,
        required: true
    },
    contentWarnings: {
        type: [String],
        required: false
    },
    additionalInstructions: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const ChapterSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recap: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Story = mongoose.models.Story || mongoose.model('Story', StorySchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);

export { Story, User, Chapter };