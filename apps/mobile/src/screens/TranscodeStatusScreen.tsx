import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

interface TranscodeJob {
  id: string;
  videoTitle: string;
  productName: string;
  status: 'processing' | 'completed' | 'queued';
  progress: number;
  qualities: { resolution: string; status: 'done' | 'processing' | 'pending' }[];
  timeRemaining: string;
}

interface TranscodeStatusScreenProps {
  onNewUpload?: () => void;
}

export const TranscodeStatusScreen: React.FC<TranscodeStatusScreenProps> = ({ onNewUpload }) => {
  const [jobs] = useState<TranscodeJob[]>([
    {
      id: 'job-9821',
      productName: 'ATH-M50x Professional Studio Monitor',
      videoTitle: 'Raw Acoustic Frequency & Build Test.mp4',
      status: 'processing',
      progress: 74,
      qualities: [
        { resolution: '1080p (FHD 60fps)', status: 'done' },
        { resolution: '720p (HD 30fps)', status: 'done' },
        { resolution: '480p (SD Adaptive)', status: 'processing' },
        { resolution: 'HLS Master Playlist (master.m3u8)', status: 'pending' },
      ],
      timeRemaining: '~14s remaining',
    },
    {
      id: 'job-9820',
      productName: 'CNC Aluminum Mechanical Keyboard',
      videoTitle: 'Typing Sound Test & Gasket Flex.mp4',
      status: 'completed',
      progress: 100,
      qualities: [
        { resolution: '1080p (FHD 60fps)', status: 'done' },
        { resolution: '720p (HD 30fps)', status: 'done' },
        { resolution: '480p (SD Adaptive)', status: 'done' },
        { resolution: 'HLS Master Playlist (master.m3u8)', status: 'done' },
      ],
      timeRemaining: 'Complete',
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MERCHANT PIPELINE</Text>
        <Text style={styles.title}>HLS Transcoding</Text>
        <Text style={styles.subtitle}>
          Adaptive bitrate packaging ensures buyers get smooth video proof on any mobile network speed.
        </Text>
      </View>

      {jobs.map((job) => {
        const isProcessing = job.status === 'processing';
        return (
          <View key={job.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.jobId}>JOB ID: {job.id}</Text>
                <Text style={styles.productName}>{job.productName}</Text>
                <Text style={styles.videoTitle}>{job.videoTitle}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isProcessing ? styles.statusProcessing : styles.statusCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isProcessing ? { color: '#D4FF32' } : { color: '#4ADE80' },
                  ]}
                >
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
                <Text style={styles.progressText}>{job.progress}% Encoded</Text>
                <Text style={styles.remainingText}>{job.timeRemaining}</Text>
              </View>
            </View>

            {/* Renditions Breakdown */}
            <View style={styles.resolutionList}>
              <Text style={styles.resHeader}>HLS Renditions & Multi-Bitrate Streams:</Text>
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
                    {q.status === 'done'
                      ? '✓ Ready'
                      : q.status === 'processing'
                      ? '⏳ Encoding...'
                      : '• Queued'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {onNewUpload && (
        <TouchableOpacity style={styles.uploadNewBtn} onPress={onNewUpload} activeOpacity={0.85}>
          <Text style={styles.uploadNewBtnText}>+ Publish Another Video Proof</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  eyebrow: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  jobId: {
    color: '#71717A',
    fontSize: 10,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
    marginBottom: 2,
    letterSpacing: 1,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  videoTitle: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusProcessing: {
    backgroundColor: 'rgba(212, 255, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 50, 0.3)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#222222',
    borderRadius: 3.5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D4FF32',
  },
  progressBarCompleted: {
    backgroundColor: '#4ADE80',
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
    color: '#71717A',
    fontSize: 11,
  },
  resolutionList: {
    backgroundColor: '#181818',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
    gap: 8,
  },
  resHeader: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resTitle: {
    color: '#E4E4E7',
    fontSize: 12,
  },
  resStatus: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
  },
  resStatusDone: {
    color: '#4ADE80',
  },
  resStatusProc: {
    color: '#D4FF32',
  },
  uploadNewBtn: {
    backgroundColor: '#D4FF32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadNewBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
});
