import config from '@/../bilal.config';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className="relative w-full footer-gradient">
            <div className="px-5 w-full h-full bg-gradient-to-b from-zinc-100 dark:from-slate-900 dark:to-slate-900/90 to-zinc-100/80">
                <div className="py-20 max-w-screen-lg w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-10">
                    <div>
                        <div className="flex items-center space-x-3 " >
                        <div className="flex items-center space-x-3 h-12 w-12 rounded-full overflow-hidden" >

                        <img  src="https://cdn.discordapp.com/attachments/1175724264465375314/1260522298235027537/speaker_dribbble_1.png?ex=668fa05f&is=668e4edf&hm=ac39c4a00061840d4ffe4580936149f71a1a28e236fdfb8aa49e4d8e733753d1&" alt="Logo" className="object-cover h-full w-full" />
                        </div>
                        <div>
                                <h1 className="text-slate-900 dark:text-zinc-50 transition-colors duration-200 leading-none text-lg font-semibold">BilalTM</h1>
                                <h3 className="text-slate-700 dark:text-zinc-400 transition-colors duration-200 leading-none text-sm">Developer</h3>
                            </div>
                        </div>
                    </div>
                    <div className="flex md:justify-end">
                        <div>
                            <h1 className="font-semibold text-slate-900 dark:text-zinc-50 transition-colors duration-200 text-lg">Navigation</h1>
                            <ul>
                                {config.header_items.map((item, i) => (
                                    <li key={`footer-${i}`}>
                                        <Link href={item.href} className="text-slate-700 dark:text-zinc-300 dark:hover:text-zinc-200 hover:text-slate-800 relative after:absolute after:left-0 after:bottom-0 after:right-full transition-colors after:transition-all after:duration-200 after:rounded-full cursor-pointer duration-200 after:h-px after:bg-slate-800 dark:after:bg-zinc-200 hover:after:right-0">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex md:justify-end">
                        <div>
                            <h1 className="font-semibold text-slate-900 dark:text-zinc-50 transition-colors duration-200 text-lg">Social</h1>
                            <ul>
                                <li>
                                    <a href="https://discord.com/users/603868522195714049" target="_blank" referrerPolicy="no-referrer" className="text-slate-700 dark:text-zinc-300 dark:hover:text-zinc-200 hover:text-slate-800 relative after:absolute after:left-0 after:bottom-0 after:right-full transition-colors after:transition-all after:duration-200 after:rounded-full cursor-pointer duration-200 after:h-px after:bg-slate-800 dark:after:bg-zinc-200 hover:after:right-0">Discord</a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/TMBilalTM" target="_blank" referrerPolicy="no-referrer" className="text-slate-700 dark:text-zinc-300 dark:hover:text-zinc-200 hover:text-slate-800 relative after:absolute after:left-0 after:bottom-0 after:right-full transition-colors after:transition-all after:duration-200 after:rounded-full cursor-pointer duration-200 after:h-px after:bg-slate-800 dark:after:bg-zinc-200 hover:after:right-0">Twitter</a>
                                </li>
                                <li>
                                    <a href="https://github.com/TMBilalTM" target="_blank" referrerPolicy="no-referrer" className="text-slate-700 dark:text-zinc-300 dark:hover:text-zinc-200 hover:text-slate-800 relative after:absolute after:left-0 after:bottom-0 after:right-full transition-colors after:transition-all after:duration-200 after:rounded-full cursor-pointer duration-200 after:h-px after:bg-slate-800 dark:after:bg-zinc-200 hover:after:right-0">GitHub</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-lg w-full mx-auto py-10 border-t border-slate-700/10 dark:border-zinc-400/10 transition-colors duration-200 flex items-center justify-between">
                    <h1 className="text-slate-900 dark:text-zinc-50 transition-colors duration-200 text-xs sm:text-sm">
                        Copyright &copy; 2023-{new Date().getFullYear()}
                    </h1>
                    <h1 className="text-slate-900 dark:text-zinc-50 transition-colors duration-200 text-xs sm:text-sm">
                        Developed with <i className="fas fa-heart" /> by <a className="font-medium" target="_blank" href="https://github.com/TMBilalTM" referrerPolicy="no-referrer">BilalTM</a>.
                    </h1>
                </div>
            </div>
        </div>
    );
};