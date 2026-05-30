import 'dart:io';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class SendImageScreen extends StatefulWidget {
  final String imagePath;

  const SendImageScreen({super.key, required this.imagePath});

  @override
  State<SendImageScreen> createState() => _SendImageScreenState();
}

class _SendImageScreenState extends State<SendImageScreen> {
  // Mock data cho danh sách bạn bè
  final List<String> _friends = ['ahn', 'giang', 'huy', 'linh'];

  void _showCaptionBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF1E1E1E), // Xám đen giống iOS
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          padding: const EdgeInsets.only(bottom: 40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              // Drag handle
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[600],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Chú thích',
                style: TextStyle(
                  fontFamily: 'SF Pro Text',
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 24),
              
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'General',
                      style: TextStyle(
                        fontFamily: 'SF Pro Text',
                        color: Colors.white54,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 16,
                      children: [
                        _buildBottomSheetPill(
                          icon: 'Aa',
                          label: 'Văn bản',
                          isTextIcon: true,
                        ),
                        // Mock color picker dots
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _buildColorDot(Colors.brown),
                              const SizedBox(width: 8),
                              _buildColorDot(Colors.grey),
                              const SizedBox(width: 8),
                              _buildColorDot(Colors.white54),
                              const SizedBox(width: 8),
                              _buildColorDot(Colors.white70),
                              const SizedBox(width: 8),
                              _buildColorDot(Colors.white),
                            ],
                          ),
                        ),
                        _buildBottomSheetPill(
                          icon: Icons.location_on_rounded,
                          label: 'Vị trí',
                        ),
                        _buildBottomSheetPill(
                          icon: Icons.wb_sunny_rounded,
                          label: 'Thời tiết',
                          iconColor: Colors.amber,
                          backgroundColor: Colors.blue,
                        ),
                        _buildBottomSheetPill(
                          icon: Icons.access_time_filled_rounded,
                          label: '2:09 CH',
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Decorative',
                      style: TextStyle(
                        fontFamily: 'SF Pro Text',
                        color: Colors.white54,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 16,
                      children: [
                        _buildBottomSheetPill(
                          icon: '🪩',
                          label: 'Quẩy thôi!',
                          isEmoji: true,
                          backgroundColor: const Color(0xFFC0FF61),
                          textColor: Colors.black,
                        ),
                        _buildBottomSheetPill(
                          icon: '🎆',
                          label: 'Boombayah',
                          isEmoji: true,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Widget _buildColorDot(Color color) {
    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildBottomSheetPill({
    required dynamic icon,
    required String label,
    bool isTextIcon = false,
    bool isEmoji = false,
    Color backgroundColor = const Color(0x1AFFFFFF), // White 10%
    Color textColor = Colors.white,
    Color? iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isTextIcon)
            Text(
              icon as String,
              style: TextStyle(
                fontFamily: 'SF Pro Text',
                color: textColor,
                fontWeight: FontWeight.w700,
                fontSize: 16,
              ),
            )
          else if (isEmoji)
            Text(
              icon as String,
              style: const TextStyle(fontSize: 18),
            )
          else
            Icon(
              icon as IconData,
              color: iconColor ?? textColor,
              size: 20,
            ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontFamily: 'SF Pro Text',
              color: textColor,
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Align(
                    alignment: Alignment.center,
                    child: Text(
                      'Gửi đến...',
                      style: TextStyle(
                        fontFamily: 'SF Pro Text',
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () {
                        // Lưu ảnh
                      },
                      child: const Icon(
                        LucideIcons.download,
                        color: Colors.white54,
                        size: 24,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // Image Preview (Chiếm phần lớn không gian, co giãn linh hoạt)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(40),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Preview ảnh thực tế
                      Image.file(
                        File(widget.imagePath),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          // Fallback nếu không có ảnh thực (lúc test animation)
                          return Container(
                            color: Colors.grey[800],
                            child: const Center(
                              child: Icon(Icons.image, size: 60, color: Colors.white54),
                            ),
                          );
                        },
                      ),
                      
                      // Nút "Thêm một tin nhắn" dạng pill ở dưới cùng
                      Positioned(
                        bottom: 24,
                        left: 0,
                        right: 0,
                        child: Center(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.5),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: const Text(
                              'Thêm một tin nhắn',
                              style: TextStyle(
                                fontFamily: 'SF Pro Text',
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Pagination Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(8, (index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: index == 0 ? Colors.white : Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                );
              }),
            ),

            const SizedBox(height: 24),

            // Action Buttons
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Nút X
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: const BoxDecoration(
                        color: Colors.transparent,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close_rounded,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),
                  
                  // Nút Gửi (Dùng Hero để chuyển tiếp animation từ Camera)
                  Hero(
                    tag: 'capture_to_send_button',
                    child: Material(
                      type: MaterialType.transparency,
                      child: GestureDetector(
                        onTap: () {
                          // Handle send
                        },
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: const BoxDecoration(
                            color: Color(0xFF333333),
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.send_rounded, // Mũi tên giấy
                              color: Colors.white,
                              size: 36,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  // Nút Aa (Chú thích)
                  GestureDetector(
                    onTap: _showCaptionBottomSheet,
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white54, width: 2),
                      ),
                      child: const Stack(
                        alignment: Alignment.center,
                        clipBehavior: Clip.none,
                        children: [
                          Text(
                            'Aa',
                            style: TextStyle(
                              fontFamily: 'SF Pro Text',
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Positioned(
                            top: -2,
                            right: -6,
                            child: Icon(
                              Icons.auto_awesome, // Sparkles
                              color: Colors.white,
                              size: 16,
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Danh sách người nhận
            SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _friends.length + 1,
                itemBuilder: (context, index) {
                  if (index == 0) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 16),
                      child: Column(
                        children: [
                          Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.amber, width: 2),
                            ),
                            child: Container(
                              margin: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.grey[800],
                              ),
                              child: const Icon(Icons.people_alt, color: Colors.white, size: 24),
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Tất cả',
                            style: TextStyle(
                              fontFamily: 'SF Pro Text',
                              color: Colors.amber,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    );
                  }
                  
                  final friendName = _friends[index - 1];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: Column(
                      children: [
                        Container(
                          width: 54,
                          height: 54,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.grey[900],
                          ),
                          child: const Icon(Icons.person, color: Colors.white54, size: 24),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          friendName,
                          style: const TextStyle(
                            fontFamily: 'SF Pro Text',
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
