import React, { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Custom toolbar configuration for rich text editing
const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],
  ['link'],
  ['clean']
]

// Quill modules configuration
const modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
}

// Quill formats
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'color', 'background', 'link'
]

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write your content...',
  className = '',
  error = '',
  maxLength = 5000,
  showCharCount = true
}) => {
  const quillRef = useRef(null)
  const charCount = value ? value.replace(/<[^>]*>/g, '').length : 0

  const handleChange = (content) => {
    // Prevent content longer than maxLength
    const plainText = content.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) {
      onChange(content)
    }
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={`min-h-[150px] ${error ? 'border-red-500' : ''}`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {showCharCount && (
        <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
          <span>Rich text editor with formatting options</span>
          <span className={`${charCount > maxLength * 0.9 ? 'text-orange-600' : ''}`}>
            {charCount}/{maxLength} characters
          </span>
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
