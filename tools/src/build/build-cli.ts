import path from 'path';
import PathUtils from '../path.js';
import BuildUtils from './utils.js'
export async function buildCli () {
    console.log('🚀 准备打包 CLI...');
    const cliDir = PathUtils.resolveFromRoot('cli')
    const cliDistPath = path.join(cliDir, '/dist')
    const cliBinPath = path.join(cliDir, '/bin')
    const cliTemplatePath = path.join(cliDir, '/templates')
    const packagePath = path.join(cliDir, '/package.json')
    try {
        await BuildUtils.clean(cliDistPath);
        console.log('🧶 编译 TypeScript...');
        await BuildUtils.execCommand('npm run build', cliDir)
        console.log('🔬 验证编译结果...');
        await BuildUtils.access(cliDistPath)
        console.log('📂 复制二进制文件夹...');
        await BuildUtils.copyAuto(cliBinPath, cliDistPath)
        console.log('📂 复制模板...');
        await BuildUtils.copyAuto(cliTemplatePath, cliDistPath)
        console.log('📂 复制package.json...');
        await BuildUtils.copyAuto(packagePath, cliDistPath)
        console.log('🥳 CLI 构建成功！');
    } catch (error) {
        console.error(`😵‍💫 CLI 构建失败！${error}`);
    }
} 