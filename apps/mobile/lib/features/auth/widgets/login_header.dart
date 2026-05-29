import 'package:flutter/material.dart';

import '../login_design.dart';

class LoginHeader extends StatelessWidget {
  final LoginMetrics metrics;

  const LoginHeader({super.key, required this.metrics});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      height: metrics.panelTop,
      child: Stack(
        children: [
          Positioned(
            top: metrics.backTop,
            left: 28,
            child: IconButton(
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints.tightFor(width: 28, height: 28),
              icon: const Icon(
                Icons.chevron_left,
                color: Colors.white,
                size: 24,
              ),
              onPressed: () => Navigator.of(context).maybePop(),
            ),
          ),
          Positioned(
            top: metrics.logoTop,
            left: 0,
            right: 0,
            child: Center(
              child: Image.asset(
                LoginAssets.logo,
                width: 126,
                height: 28,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
