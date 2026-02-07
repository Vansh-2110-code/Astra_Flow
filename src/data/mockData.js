
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export const workspaces = [
    { id: 1, name: "Marketing Campaign 2024", posts: 24, activity: "2 hours ago" },
    { id: 2, name: "Social Media - Q1", posts: 12, activity: "Yesterday" },
    { id: 3, name: "Product Launch", posts: 8, activity: "5 days ago" },
    { id: 4, name: "Brand Awareness", posts: 156, activity: "1 week ago" },
];

export const posts = [
    {
        id: 1,
        platform: "Instagram",
        icon: Instagram,
        content: "Excited to announce our new feature drop! 🚀 #LaunchDay #NewFeature",
        media: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60",
        date: "2024-03-15",
        status: "Approved",
        author: "Sarah J."
    },
    {
        id: 2,
        platform: "Twitter",
        icon: Twitter,
        content: "What's the one tool you can't live without as a developer? 👇",
        media: null,
        date: "2024-03-16",
        status: "Draft",
        author: "Mike T."
    },
    {
        id: 3,
        platform: "LinkedIn",
        icon: Linkedin,
        content: "Join us for a webinar on the future of AI in marketing. Link in bio.",
        media: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
        date: "2024-03-18",
        status: "Pending Approval",
        author: "Jessica B."
    },
    {
        id: 4,
        platform: "Facebook",
        icon: Facebook,
        content: "Happy Friday team! Here are some highlights from this week.",
        media: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60",
        date: "2024-03-20",
        status: "Scheduled",
        author: "John S."
    }
];

export const teamMembers = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Jones", email: "sarah@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Mike Taylor", email: "mike@example.com", role: "Contributor", status: "Pending" },
    { id: 4, name: "Jessica Brown", email: "jessica@example.com", role: "Approver", status: "Active" },
];
