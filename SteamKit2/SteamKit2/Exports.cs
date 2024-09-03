#pragma warning disable CS1591 // 缺少对公共可见类型或成员的 XML 注释

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text;
using System.Threading.Tasks;
using SteamKit2.CDN;

[assembly: SupportedOSPlatform("browser")]

namespace SteamKit2;

/// <summary>
/// wasm导出
/// </summary>
public static partial class Exports
{
    private static readonly Dictionary<uint, DepotManifest> manifestDictionary = new();

    [UnmanagedCallersOnly( EntryPoint = "Free" )]
    public static unsafe void Free( void* ptr )
    => NativeMemory.Free( ptr );

    /// <summary>
    /// 等同于mmapAlloc()
    /// </summary>
    /// <param name="size"></param>
    /// <returns></returns>
    [UnmanagedCallersOnly( EntryPoint = "Alloc" )]
    public static unsafe void* Alloc( int size )
        => NativeMemory.Alloc( ( nuint )size );


}
