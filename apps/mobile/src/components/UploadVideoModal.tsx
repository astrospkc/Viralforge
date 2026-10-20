import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

interface UploadVideoModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [productName, setProductName] = useState('ATH-M50x Studio Headphones');
  const [productPrice, setProductPrice] = useState('$149.00');
  const [videoTitle, setVideoTitle] = useState('Unedited Audio & Ear-Cup Isolation Test');
  const [category, setCategory] = useState('Audio');
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [transcodeProgress, setTranscodeProgress] = useState(0);

  const handleStartPublish = () => {
    if (!productName || !videoTitle) {
      Alert.alert('Required', 'Please fill in product name and video title.');
      return;
    }

    setIsTranscoding(true);
    setTranscodeProgress(10);

    const interval = setInterval(() => {
      setTranscodeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTranscoding(false);
            setTranscodeProgress(0);
            Alert.alert(
              '🎉 Published Successfully!',
              'Your video proof has been transcoded to HLS (1080p, 720p, 480p) and is now live on the Shop feed.'
            );
            onSuccess();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MERCHANT STUDIO</Text>
              <Text style={styles.title}>Publish Video Proof</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stock Verification Badge */}
            <View style={styles.verificationBanner}>
              <Text style={styles.checkIcon}>✓</Text>
              <View style={styles.verificationTextCol}>
                <Text style={styles.verifiedTitle}>Real Proof-of-Work Guarantee</Text>
                <Text style={styles.verifiedSub}>
                  Videos automatically receive the "VIDEO PROOF" trust badge once HLS transcoding finishes.
                </Text>
              </View>
            </View>

            {/* Input Form */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product in Stock</Text>
              <TextInput
                style={styles.input}
                value={productName}
                onChangeText={setProductName}
                placeholder="Product Name"
                placeholderTextColor="#71717A"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={productPrice}
                  onChangeText={setProductPrice}
                  placeholder="$0.00"
                  placeholderTextColor="#71717A"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Tech, Audio, Style..."
                  placeholderTextColor="#71717A"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Proof Video Headline</Text>
              <TextInput
                style={styles.input}
                value={videoTitle}
                onChangeText={setVideoTitle}
                placeholder="e.g. Uncut durability & feature demonstration"
                placeholderTextColor="#71717A"
              />
            </View>

            {/* Transcoding Progress Indicator */}
            {isTranscoding && (
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Transcoding HLS Adaptive Bitrate...</Text>
                  <Text style={styles.progressPercent}>{transcodeProgress}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${transcodeProgress}%` }]} />
                </View>
                <View style={styles.resRow}>
                  <Text style={[styles.resPill, transcodeProgress >= 25 && styles.resPillActive]}>
                    1080p FHD
                  </Text>
                  <Text style={[styles.resPill, transcodeProgress >= 50 && styles.resPillActive]}>
                    720p HD
                  </Text>
                  <Text style={[styles.resPill, transcodeProgress >= 75 && styles.resPillActive]}>
                    480p SD
                  </Text>
                  <Text style={[styles.resPill, transcodeProgress >= 100 && styles.resPillActive]}>
                    Master.m3u8
                  </Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.publishBtn, isTranscoding && styles.publishBtnDisabled]}
              onPress={handleStartPublish}
              disabled={isTranscoding}
            >
              <Text style={styles.publishBtnText}>
                {isTranscoding ? 'Processing Video...' : '🚀 Transcode & Publish Proof'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#262626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '700',
  },
  verificationBanner: {
    flexDirection: 'row',
    backgroundColor: '#192211',
    borderWidth: 1,
    borderColor: '#2D3F1D',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    color: '#D4FF32',
    fontSize: 18,
    fontWeight: '900',
  },
  verificationTextCol: {
    flex: 1,
  },
  verifiedTitle: {
    color: '#D4FF32',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  verifiedSub: {
    color: '#A1A1AA',
    fontSize: 11,
    lineHeight: 15,
  },
  formGroup: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressPercent: {
    color: '#D4FF32',
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#262626',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4FF32',
  },
  resRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resPill: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
  },
  resPillActive: {
    color: '#D4FF32',
  },
  publishBtn: {
    backgroundColor: '#D4FF32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  publishBtnDisabled: {
    opacity: 0.6,
  },
  publishBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});

