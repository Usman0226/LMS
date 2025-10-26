import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, CheckCircle, Clock } from 'lucide-react';

const LessonViewer = ({ lesson, onComplete, isCompleted, progress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No lesson selected</p>
      </div>
    );
  }

  const handlePlayPause = () => {
    const video = document.getElementById(`video-${lesson._id}`);
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const video = document.getElementById(`video-${lesson._id}`);
    if (video) {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    }
  };

  const handleMuteToggle = () => {
    const video = document.getElementById(`video-${lesson._id}`);
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              id={`video-${lesson._id}`}
              src={lesson.mediaUrl}
              className="w-full h-auto max-h-96"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(document.getElementById(`video-${lesson._id}`).duration)}
              controls={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center justify-between text-white text-sm">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <button onClick={handleMuteToggle} className="p-1">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <audio
              id={`audio-${lesson._id}`}
              src={lesson.mediaUrl}
              controls
              className="w-full"
            />
          </div>
        );

      case 'document':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <iframe
              src={lesson.mediaUrl}
              className="w-full h-96 border rounded"
              title={lesson.title}
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {lesson.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {lesson.description}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>{lesson.duration || 0} minutes</span>
          {lesson.isPreview && (
            <>
              <span className="mx-2">•</span>
              <span className="text-primary-600 font-medium">Preview</span>
            </>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Progress and Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {progress !== undefined && (
            <span>Progress: {Math.round(progress)}%</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {lesson.type === 'document' && lesson.mediaUrl && (
            <a
              href={lesson.mediaUrl}
              download
              className="btn-secondary flex items-center text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          )}

          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`btn-primary flex items-center text-sm px-4 py-2 ${
              isCompleted ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
