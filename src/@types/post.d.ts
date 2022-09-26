interface Post {
  _id: string;
  title: string;
  text?: string;
  attachments: Attachment[];
  thumbnail?: string;
  tags: PostTag[];
  contact: string;
  owner: string;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  fileType: string;
  url?: string;
}

interface PostTag {
  label: string;
  value: string;
  color: string;
}
