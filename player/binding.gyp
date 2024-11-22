{
    "targets": [
        {
            "target_name": "mixer-player",
            "sources": ["src/addon.cpp"],
            "include_dirs": ["../lib/include"],

            'libraries': ['../lib/lib/libSDL2.a', "../lib/lib/libSDL2main.a", '../lib/lib/libSDL2.dll.a', '../lib/lib/libSDL2_mixer.a', '../lib/lib/libSDL2_mixer.dll.a', '../lib/lib/libSDL2_test.a', "../lib/lib/libgcc.a", "../lib/lib/libmingw32.a", "../lib/lib/libmingwex.a"],

        }
    ]
}