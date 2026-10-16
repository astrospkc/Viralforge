import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface TranscodeJob {
  id: string;
  videoTitle: string;
  status: 'processing' | 'completed' | 'queued';
  progress: number;
  qualities: { resolution: string; status: 'done' | 'processing' | 'pending' }[];
  timeRemaining: string;
}

export const TranscodeStatusScreen: React.FC = () => {
  const [jobs] = useState<TranscodeJob[]>([
    {
      id: 'job-9821',
      videoTitle: 'Microservices & HLS Pipeline Demo.mp4',
      status: 'processing',
      progress: 74,
      qualities: [
        { resolution: '1080p (FHD)', status: 'done' },
        { resolution: '720p (HD)', status: 'done' },
        { resolution: '480p (SD)', status: 'processing' },
        { resolution: 'HLS Master Playlist', status: 'pending' },
      ],
      timeRemaining: '~18s remaining',
    },
    {
      id: 'job-9820',
      videoTitle: 'Next-Gen Video Player Showcase.mp4',
      status: 'completed',
      progress: 100,
      qualities: [
        { resolution: '1080p (FHD)', status: 'done' },
        { resolution: '720p (HD)', status: 'done' },
        { resolution: '480p (SD)', status: 'done' },
        { resolution: 'HLS Master Playlist', status: 'done' },
      ],
      timeRemaining: 'Complete',
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Transcoding Pipeline</Text>
        <Text style={styles.subtitle}>
          Real-time video transcoding, adaptive bitrate HLS packaging status
        </Text>
      </View>

      {jobs.map((job) => {
        const isProcessing = job.status === 'processing';
        return (
          <View key={job.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.jobId}>Job ID: {job.id}</Text>
                <Text style={styles.videoTitle}>{job.videoTitle}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isProcessing ? styles.statusProcessing : styles.statusCompleted,
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {job.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${job.progress}%` },
                    !isProcessing && styles.progressBarCompleted,
                  ]}
                />
              </View>
              <View style={styles.progressMeta}>
                <Text style={styles.progressText}>{job.progress}%</Text>
                <Text style={styles.remainingText}>{job.timeRemaining}</Text>
              </View>
            </View>

            {/* Resolutions Breakdown */}
            <View style={styles.resolutionList}>
              <Text style={styles.resHeader}>Renditions & HLS Playlists:</Text>
              {job.qualities.map((q) => (
                <View key={q.resolution} style={styles.resRow}>
                  <Text style={styles.resTitle}>{q.resolution}</Text>
                  <Text
                    style={[
                      styles.resStatus,
                      q.status === 'done' && styles.resStatusDone,
                      q.status === 'processing' && styles.resStatusProc,
                    ]}
                  >
                    {q.status === 'done' ? '✓ Ready' : q.status === 'processing' ? '⏳ Encoding' : '• Pending'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={styles.uploadNewBtn}>
        <Text style={styles.uploadNewBtnText}>+ Upload New Video for Transcoding</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  jobId: {
    color: '#888888',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 220,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusProcessing: {
    backgroundColor: '#3b2d12',
  },
  statusCompleted: {
    backgroundColor: '#13351f',
  },
  statusBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E50914',
  },
  progressBarCompleted: {
    backgroundColor: '#22C55E',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  remainingText: {
    color: '#888888',
    fontSize: 12,
  },
  resolutionList: {
    backgroundColor: '#161616',
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  resHeader: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resTitle: {
    color: '#DDDDDD',
    fontSize: 13,
  },
  resStatus: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  },
  resStatusDone: {
    color: '#22C55E',
  },
  resStatusProc: {
    color: '#E50914',
  },
  uploadNewBtn: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadNewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

