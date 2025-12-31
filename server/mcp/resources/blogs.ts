import type { ReadResourceTemplateCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default defineMcpResource({
  name: 'blogs',
  description: 'litingyes\'s blogs',
  uri: new ResourceTemplate('litingyes://mcp/resources/blogs/{filename}', {
    list: async () => {
      const root = process.cwd()
      const blogs = readdirSync(
        path.join(root, 'content', 'blog'),
        {
          withFileTypes: true,
        },
      )

      return {
        resources: await Promise.all(blogs.map(async (blog) => {
          const content = readFileSync(path.join(blog.parentPath, blog.name), 'utf-8')
          const config = await parseMarkdown(content)

          return {
            uri: `litingyes://mcp/resources/blogs/${blog.name}`,
            name: blog.name,
            title: config.data.title,
            description: config.data.description,
          }
        })),
      }
    },
  }),
  handler: ((uri, variables) => {
    try {
      const root = process.cwd()

      const filePath = path.join(root, 'content', 'blog', variables.filename as string)
      const content = readFileSync(filePath, 'utf-8')

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      }
    }
    catch (error) {
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'text/markdown',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  }) satisfies ReadResourceTemplateCallback,
})
