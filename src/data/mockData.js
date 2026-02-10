
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const workspaces = [
    { 
        id: 1, 
        name: "Mint Cloud", 
        posts: 24, 
        activity: "2 hours ago",
        connectedPlatforms: ['Instagram', 'Facebook', 'LinkedIn']
    },
    { 
        id: 2, 
        name: "Social Media - Q1", 
        posts: 12, 
        activity: "Yesterday",
        connectedPlatforms: ['Instagram', 'Facebook']
    },
    { 
        id: 3, 
        name: "Product Launch", 
        posts: 8, 
        activity: "5 days ago",
        connectedPlatforms: ['Instagram', 'LinkedIn']
    },
    { 
        id: 4, 
        name: "Brand Awareness", 
        posts: 156, 
        activity: "1 week ago",
        connectedPlatforms: ['Instagram', 'Facebook', 'LinkedIn']
    },
];

export const posts = [
    {
        id: 1,
        platform: "Instagram",
        icon: Instagram,
        content: "Excited to announce our new feature drop! 🚀 #LaunchDay #NewFeature",
        media: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-15",
        status: "Published",
        author: "Sarah J.",
        approved: true,
        approvedBy: ["Admin", "Sarah J."],
        type: "Post",
        comments: [
            { text: "Great work on this!", author: "John", timestamp: "2026-02-15T10:30:00", visibility: "team" }
        ]
    },
    {
        id: 2,
        platform: "Facebook",
        icon: Facebook,
        content: "What's the one tool you can't live without as a developer? 👇 Join the conversation!",
        media: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-12",
        status: "Scheduled",
        author: "Mike T.",
        approved: true,
        approvedBy: ["Admin"],
        type: "Post",
        comments: []
    },
    {
        id: 3,
        platform: "LinkedIn",
        icon: Linkedin,
        content: "Join us for a webinar on the future of AI in marketing. Register now! Link in bio.",
        media: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-18",
        status: "Scheduled",
        author: "Jessica B.",
        approved: false,
        approvedBy: [],
        type: "Post",
        comments: []
    },
    {
        id: 4,
        platform: "Instagram",
        icon: Instagram,
        content: "Behind the scenes of our latest photoshoot 📸 Stay tuned for more! #BTS #Photography",
        media: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-20",
        status: "Scheduled",
        author: "John S.",
        approved: true,
        approvedBy: ["Sarah J.", "Mike T."],
        type: "Reel",
        comments: []
    },
    {
        id: 5,
        platform: "Facebook",
        icon: Facebook,
        content: "Happy Monday! Starting the week with positive vibes ☀️ What are your goals for this week?",
        media: null,
        date: "2026-02-10",
        status: "Published",
        author: "Sarah J.",
        approved: true,
        approvedBy: ["Admin"],
        type: "Post",
        comments: []
    },
    {
        id: 6,
        platform: "Instagram",
        icon: Instagram,
        content: "Product launch countdown! 3 days to go 🎉 #ComingSoon #ProductLaunch",
        media: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-14",
        status: "Scheduled",
        author: "Alex M.",
        approved: true,
        approvedBy: ["Admin", "Sarah J."],
        type: "Story",
        comments: []
    },
    {
        id: 7,
        platform: "LinkedIn",
        icon: Linkedin,
        content: "Thrilled to share our Q1 growth report. Revenue up 45% YoY. Read the full report in the comments.",
        media: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-08",
        status: "Published",
        author: "Jessica B.",
        approved: true,
        approvedBy: ["Admin", "Mike T."],
        type: "Post",
        comments: [
            { text: "Impressive numbers!", author: "Client A", timestamp: "2026-02-08T14:20:00", visibility: "all" }
        ]
    },
    {
        id: 8,
        platform: "Instagram",
        icon: Instagram,
        content: "Team bonding day! Love working with these amazing people 💙 #TeamWork #CompanyCulture",
        media: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-22",
        status: "Scheduled",
        author: "Mike T.",
        approved: false,
        approvedBy: [],
        type: "Post",
        comments: []
    },
    {
        id: 9,
        platform: "Facebook",
        icon: Facebook,
        content: "Customer success story: How Brand X increased their ROI by 200% using our platform. Read more →",
        media: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-25",
        status: "Scheduled",
        author: "Sarah J.",
        approved: true,
        approvedBy: ["Admin"],
        type: "Post",
        comments: []
    },
    {
        id: 10,
        platform: "Instagram",
        icon: Instagram,
        content: "New blog post is live! 5 marketing trends you need to know in 2026 📈 Link in bio",
        media: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-28",
        status: "Scheduled",
        author: "Alex M.",
        approved: false,
        approvedBy: [],
        type: "Post",
        comments: []
    },
    {
        id: 11,
        platform: "LinkedIn",
        icon: Linkedin,
        content: "We're hiring! Looking for a Senior Marketing Manager to join our growing team. DM for details.",
        media: null,
        date: "2026-02-16",
        status: "Scheduled",
        author: "Jessica B.",
        approved: true,
        approvedBy: ["Admin", "Sarah J.", "Mike T."],
        type: "Post",
        comments: []
    },
    {
        id: 12,
        platform: "Facebook",
        icon: Facebook,
        content: "Flash sale alert! 50% off all products this weekend only. Shop now before it's too late! 🛍️",
        media: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&auto=format&fit=crop&q=60",
        date: "2026-02-21",
        status: "Drafts",
        author: "Mike T.",
        approved: false,
        approvedBy: [],
        type: "Post",
        comments: []
    }
];

export const teamMembers = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Jones", email: "sarah@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Mike Taylor", email: "mike@example.com", role: "Contributor", status: "Pending" },
    { id: 4, name: "Jessica Brown", email: "jessica@example.com", role: "Approver", status: "Active" },
];
