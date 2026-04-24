import 'dart:async';

import 'package:flutter/material.dart';

import '../../../shared/utils/date_format_utils.dart';

class TimeAgoText extends StatefulWidget {
  const TimeAgoText({super.key, required this.date, this.style});

  final DateTime date;
  final TextStyle? style;

  @override
  State<TimeAgoText> createState() => _TimeAgoTextState();
}

class _TimeAgoTextState extends State<TimeAgoText> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(minutes: 1), (Timer timer) {
      if (mounted) {
        setState(() {});
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(DateFormatUtils.timeAgo(widget.date), style: widget.style);
  }
}
