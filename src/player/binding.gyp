{
    "targets": [
        {
            "target_name": "audio-player",
            "sources": ["src/addon.cpp", "src/myobject.cpp"],
            "include_dirs": ["lib/include/"],
            "conditions": [['OS == "win"', {
				'cflags': [ '-D_REENTRANT' ],
				'libraries': [ "../lib/lib/SDL2.lib", "../lib/lib/SDL2_mixer.lib", "../lib/lib/SDL2main.lib", "../lib/lib/SDL2test.lib" ],
                'copies': [
                    {
                        "destination": "build/Release",
                        "files": [
                            "lib/dll/SDL2.dll",
                            "lib/dll/SDL2_mixer.dll"
                        ]
                    }
                ]
			}]],


        }
    ]
}