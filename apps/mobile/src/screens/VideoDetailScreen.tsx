import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { MobileVideoItem } from '../types';

interface VideoDetailScreenProps {
  video: MobileVideoItem;
  onClose: () => void;
}

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(
    video.qualities[0]?.quality || 'Auto'
  );
  const [likes, setLikes] = useState(video.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Marcus Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'Great walkthrough overall. Loved the clean architecture and proof of work demonstration.',
      time: '1h ago',
    },
    {
      id: 2,
      user: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'The HLS streaming performance on this video is silky smooth!',
      time: '3h ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        text: newComment.trim(),
        time: 'Just now',
      },
      ...comments,
    ]);
    setNewComment('');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>← Back to Feed</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {video.title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Player Container */}
        <View style={styles.playerContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.playerThumbnail} />
          <View style={styles.playerOverlay}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>

            <View style={styles.playerControlsBottom}>
              <Text style={styles.timeTracker}>03:14 / {video.duration}</Text>
              <View style={styles.qualityPills}>
                {video.qualities.map((q) => (
                  <TouchableOpacity
                    key={q.quality}
                    style={[
                      styles.qualityBadge,
                      selectedQuality === q.quality && styles.qualityBadgeActive,
                    ]}
                    onPress={() => setSelectedQuality(q.quality)}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        selectedQuality === q.quality && styles.qualityTextActive,
                      ]}
                    >
                      {q.quality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Video Details */}
        <View style={styles.detailsContent}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.statsLine}>
            {video.views} views • Uploaded {video.time} • Category: {video.category}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, hasLiked && styles.actionBtnActive]}
              onPress={handleLike}
            >
              <Text style={styles.actionBtnText}>
                {hasLiked ? '❤️ Liked' : '🤍 Like'} ({likes})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>🔗 Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📥 Save</Text>
            </TouchableOpacity>
          </View>

          {/* Creator Info */}
          <View style={styles.creatorCard}>
            <Image source={{ uri: video.userAvatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>
                {video.userName} {video.userVerified ? '✓' : ''}
              </Text>
              <Text style={styles.creatorRole}>Verified Creator</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descBox}>
            <Text style={styles.descText}>{video.description}</Text>
            <View style={styles.tagRow}>
              {video.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Reviews & Comments ({comments.length})</Text>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment or review..."
                placeholderTextColor="#777"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={styles.sendCommentButton}
                onPress={handleAddComment}
              >
                <Text style={styles.sendCommentText}>Post</Text>
              </TouchableOpacity>
            </View>

            {comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{c.user}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  navBar: {
    height: 50,
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  backButtonText: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '700',
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  playerContainer: {
    width: '100%',
    height: 230,
    backgroundColor: '#000000',
    position: 'relative',
  },
  playerThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerControlsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTracker: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  qualityPills: {
    flexDirection: 'row',
    gap: 6,
  },
  qualityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: '#444444',
  },
  qualityBadgeActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  qualityText: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '700',
  },
  qualityTextActive: {
    color: '#FFFFFF',
  },
  detailsContent: {
    padding: 16,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 6,
  },
  statsLine: {
    color: '#999999',
    fontSize: 12,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#262626',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  actionBtnActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  creatorRole: {
    color: '#888888',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#E50914',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  descBox: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  descText: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#2E2E2E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagText: {
    color: '#E50914',
    fontSize: 11,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 8,
    marginBottom: 40,
  },
  commentsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendCommentButton: {
    backgroundColor: '#E50914',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  sendCommentText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#1A1A1A',
    padding: 10,
    borderRadius: 8,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  commentTime: {
    color: '#777777',
    fontSize: 11,
  },
  commentText: {
    color: '#DDDDDD',
    fontSize: 13,
    lineHeight: 18,
  },
});

