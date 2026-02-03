import { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const TextEditor = ({ value, onChange, placeholder = '', height = '300px' }: TextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'indent',
    'align',
    'color', 'background',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  return (
    <div className="text-editor-wrapper" style={{ marginBottom: '1rem' }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height, marginBottom: '42px' }}
      />
    </div>
  );
};

export default TextEditor;
