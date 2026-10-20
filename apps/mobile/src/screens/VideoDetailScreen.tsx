import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { MobileVideoItem } from '../types';

interface VideoDetailScreenProps {
  video: MobileVideoItem;
  onClose: () => void;
}

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(
    video.qualities[0]?.quality || '1080p'
  );
  const [likes, setLikes] = useState(video.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Marcus Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'The unedited sound test proves the ear-cup seal is legit. Ordered immediately after watching!',
      time: '1h ago',
    },
    {
      id: 2,
      user: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'Love that ViralForge requires real uncut proof instead of fake promotional renders.',
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

  const handleBuy = () => {
    Alert.alert(
      'Order Initiated',
      `Redirecting to ${video.shopName || 'Merchant'} checkout for ${video.productName || video.title} (${video.productPrice || '$149.00'}).`
    );
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
        <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {video.productName || video.title}
        </Text>
        <TouchableOpacity
          style={styles.saveHeaderBtn}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Text style={{ fontSize: 16 }}>{isSaved ? '🔖' : '🏷️'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Player Container */}
        <View style={styles.playerContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.playerThumbnail} />
          <View style={styles.playerOverlay}>
            {/* Top Proof Tag */}
            <View style={styles.videoProofTag}>
              <Text style={styles.proofCheck}>✓</Text>
              <Text style={styles.proofTagText}>VERIFIED VIDEO PROOF</Text>
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.8}
            >
              <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>

            <View style={styles.playerControlsBottom}>
              <Text style={styles.timeTracker}>01:14 / {video.duration}</Text>
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

        {/* Product & Merchant Purchase Box */}
        <View style={styles.purchaseBox}>
          <View style={styles.productHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle}>
                {video.productName || video.title}
              </Text>
              <Text style={styles.merchantSub}>
                Sold by <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{video.shopName || video.userName}</Text> • In Stock
              </Text>
            </View>
            <Text style={styles.priceTag}>{video.productPrice || '$149.00'}</Text>
          </View>

          <View style={styles.buyActionRow}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuy} activeOpacity={0.88}>
              <Text style={styles.buyButtonText}>🛍️ Buy Verified Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.likeButton, hasLiked && styles.likeButtonActive]}
              onPress={handleLike}
            >
              <Text style={styles.likeText}>{hasLiked ? '❤️' : '🤍'} {likes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Proof Details */}
        <View style={styles.detailsContent}>
          <Text style={styles.sectionHeader}>About This Demonstration</Text>
          <Text style={styles.descText}>{video.description}</Text>

          <View style={styles.tagRow}>
            {video.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Merchant Profile Strip */}
          <View style={styles.creatorCard}>
            <Image source={{ uri: video.userAvatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>
                {video.userName} {video.userVerified ? '✓' : ''}
              </Text>
              <Text style={styles.creatorRole}>Verified Merchant Studio</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Comments & Trust Reviews Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Buyer Reviews & Proof Feedback ({comments.length})</Text>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Ask about specs or write a review..."
                placeholderTextColor="#71717A"
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
    backgroundColor: '#000000',
  },
  navBar: {
    height: 54,
    backgroundColor: '#0E0E0E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  backButtonText: {
    color: '#D4FF32',
    fontSize: 14,
    fontWeight: '700',
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  saveHeaderBtn: {
    padding: 6,
  },
  playerContainer: {
    width: '100%',
    height: 250,
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'space-between',
    padding: 14,
  },
  videoProofTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 6,
  },
  proofCheck: {
    color: '#D4FF32',
    fontWeight: '900',
    fontSize: 12,
  },
  proofTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  playButton: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1.5,
    borderColor: '#D4FF32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#D4FF32',
    fontSize: 22,
    marginLeft: 3,
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
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: '#333333',
  },
  qualityBadgeActive: {
    backgroundColor: '#D4FF32',
    borderColor: '#D4FF32',
  },
  qualityText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  qualityTextActive: {
    color: '#000000',
  },
  purchaseBox: {
    margin: 16,
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262626',
  },
  productHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    marginBottom: 4,
  },
  merchantSub: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  priceTag: {
    color: '#D4FF32',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 12,
  },
  buyActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#D4FF32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  likeButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButtonActive: {
    borderColor: '#D4FF32',
  },
  likeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  detailsContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  descText: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '600',
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222222',
    marginBottom: 24,
  },
  creatorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  creatorRole: {
    color: '#71717A',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    color: '#FFFFFF',
    fontSize: 15,
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
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendCommentButton: {
    backgroundColor: '#D4FF32',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  sendCommentText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  commentUser: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  commentTime: {
    color: '#71717A',
    fontSize: 11,
  },
  commentText: {
    color: '#D4D4D8',
    fontSize: 12,
    lineHeight: 18,
  },
});
