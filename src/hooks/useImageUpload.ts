// src/hooks/useImageUpload.ts

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/services/firebase/config';
import * as ImagePicker from 'expo-image-picker';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access photos was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  };

  const uploadImage = async (
    uri: string,
    path: string
  ): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);

      // Fetch the image
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(storage, path);

      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            setUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  return { pickImage, uploadImage, uploading, progress };
}