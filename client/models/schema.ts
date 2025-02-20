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

const StorySettingsSchema = new mongoose.Schema({
    agentWriter: {
        type: Boolean,
        required: true
    },
    interval: {
        type: Number,
        required: true
    },
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    moral: {
        type: String,
        required: false
    },
    writingStyle: {
        type: String,
        required: false
    },
    wordCount: {
        type: Number,
        required: false
    },
    contentWarnings: {
        type: [String],
        required: false
    },
    additionalInstructions: {
        type: String,
        required: false
    },
    guidelines: {
        type: String,
        required: false
    },
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
    themes: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const StoryStatusSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    numReaders: {
        type: Number,
        required: true
    },
    readers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    }
});

const EndgameProtocolSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    numChapters: {
        type: Number,
        required: true
    }
})

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
const StorySettings = mongoose.models.StorySettings || mongoose.model('StorySettings', StorySettingsSchema);
const StoryStatus = mongoose.models.StoryStatus || mongoose.model('StoryStatus', StoryStatusSchema);    
const EndgameProtocol = mongoose.models.EndgameProtocol || mongoose.model('EndgameProtocol', EndgameProtocolSchema);
export { Story, User, Chapter, StorySettings, StoryStatus, EndgameProtocol };