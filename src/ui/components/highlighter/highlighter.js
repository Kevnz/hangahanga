import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism'

SyntaxHighlighter.registerLanguage('jsx', jsx)

const Highlighter = ({ children, ...props }) => {
  return (
    <SyntaxHighlighter
      language="jsx"
      style={prism}
      showLineNumbers={false}
      wrapLines={true}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  )
}

export { Highlighter }

export default Highlighter
