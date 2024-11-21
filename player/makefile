#OBJS specifies which files to compile as part of the project
OBJS = src/main.cpp

#CC specifies which compiler we're using
CC = g++

#INCLUDE_PATHS specifies the additional include paths we'll need
INCLUDE_PATHS = -ID:\Dev\blessed-player\player\lib\include

#LIBRARY_PATHS specifies the additional library paths we'll need
LIBRARY_PATHS = -LD:\Dev\blessed-player\player\lib\lib

#COMPILER_FLAGS specifies the additional compilation options we're using
# -w suppresses all warnings
# -Wl,-subsystem,windows gets rid of the console window
COMPILER_FLAGS = 

#LINKER_FLAGS specifies the libraries we're linking against
LINKER_FLAGS = -lmingw32 -lSDL2main -lSDL2 -lSDL2_mixer

#OBJ_NAME specifies the name of our exectuable
OBJ_NAME = dist/main.exe

#This is the target that compiles our executable
all : build run

build:  $(OBJS)
	$(CC) $(OBJS) $(INCLUDE_PATHS) $(LIBRARY_PATHS) $(COMPILER_FLAGS) $(LINKER_FLAGS) -o $(OBJ_NAME)

run: $(OBJ_NAME)
	$(OBJ_NAME)