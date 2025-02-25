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
    email: {
        type: String,
        required: true
    },
    password: {
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
},
    {
        timestamps: true
    }
);

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
},
    {
        timestamps: true
    }
);


const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending',
        required: true
    }
},
    {
        timestamps: true
    }
);


const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: {
        type: [QuestionSchema],
        required: true
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    }
});

const PointSchema = new mongoose.Schema({
    point: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    }
});

const FollowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    }
});

const Story = mongoose.models.Story || mongoose.model('Story', StorySchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
const StorySettings = mongoose.models.StorySettings || mongoose.model('StorySettings', StorySettingsSchema);
const StoryStatus = mongoose.models.StoryStatus || mongoose.model('StoryStatus', StoryStatusSchema);
const EndgameProtocol = mongoose.models.EndgameProtocol || mongoose.model('EndgameProtocol', EndgameProtocolSchema);
const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
const Point = mongoose.models.Point || mongoose.model('Point', PointSchema);
const Follow = mongoose.models.Follow || mongoose.model('Follow', FollowSchema);
export { Story, User, Chapter, StorySettings, StoryStatus, EndgameProtocol, Brand, Point, Follow };