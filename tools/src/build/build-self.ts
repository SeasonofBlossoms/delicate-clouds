import path from 'path';
import BuildUtils from './utils.js'
console.log('🚀 准备打包 tools...');
const rootDir = process.cwd()
const distPath = path.join(rootDir, '/dist')
const binPath = path.join(rootDir, '/bin')
const packagePath = path.join(rootDir, '/package.json')
try {
    await BuildUtils.clean(distPath);
    console.log('🧶 编译 TypeScript...');
    await BuildUtils.execCommand('npm run build', rootDir)
    console.log('🔬 验证编译结果...');
    await BuildUtils.access(distPath)
    console.log('📂 复制二进制文件夹...');
    await BuildUtils.copyAuto(binPath, distPath)
    console.log('📂 复制package.json...');
    await BuildUtils.copyAuto(packagePath, distPath)
    console.log('🥳 tools 构建成功！');
} catch (error) {
    console.error(`😵‍💫 tools 构建失败！${error}`);
}