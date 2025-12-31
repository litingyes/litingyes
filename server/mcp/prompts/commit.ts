export default defineMcpPrompt({
  name: 'commit',
  description: '遵循 Conventional Commits Specification commit 代码改动',
  handler: async () => {
    return {
      messages: [

        {
          role: 'assistant',
          content: {
            type: 'resource_link',
            uri: 'litingyes://mcp/resources/conventional-commits.md',
            name: 'Conventional Commits Specification',
            description: 'Conventional Commits Specification',
            mimeType: 'text/markdown',
          },
        },
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# commit 代码改动

## 流程
1. 使用 \`git status\` 检查 git 当前文件改动状态
    a. 如果当前有文件改动没有提交到暂存区，询问是否要提交
    b. 如果没有任何文件改动，终止当前流程
2. 结合项目上下文分析和总结代表改动，包括改动内容及其影响
3. 严格遵许 Conventional Commits Specification 来提交文件改动

## 注意
1. git commit message 内容必须全部是 English`,
          },
        },
      ],
    }
  },
})
